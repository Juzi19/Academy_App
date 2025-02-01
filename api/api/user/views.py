from django.shortcuts import render, get_object_or_404
import stripe
from .models import User, Subscription
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import datetime

stripe.api_key = "api_key"

#start a subscribion and redirect to stripe
def subscribe(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            price_id = data.get("price_id")
            success_url = data.get("success_url")
            cancel_url = data.get("cancel_url")
            user = get_object_or_404(User, id=user_id)
            create_stripe_customer(user)
            url = create_subsciption(user, price_id, success_url, cancel_url)
            return JsonResponse({'url': url})
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

#View to update a users payment methods
def update_payment(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))
            user_id = data.get("user_id")
            payment_method_id = data.get("payment_method_id")
            user = get_object_or_404(User, id=user_id)
            update_subscription_payment_method(user, payment_method_id)
            return JsonResponse({}, status=200)
        except:
            return JsonResponse({"error": "Error when handling updateing the payment / Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

# Requesting a user's invoices
def get_customer_invoices(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Requesting invoices from stripe
            invoices = stripe.Invoice.list(customer=user.stripe_customer_id, limit=10)
            invoice_data = [
                {
                    "id": invoice.id,
                    "amount_due": invoice.amount_due / 100,  # Price in €
                    "status": invoice.status,  # "paid", "open", "void"
                    "pdf_url": invoice.invoice_pdf,  # PDF-download-link
                    "created": invoice.created,  # invoice's timestamp
                }
                for invoice in invoices.auto_paging_iter()
            ]

            return JsonResponse({"invoices": invoice_data})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

#Creates a new user
def create_user(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            name = data.get("name")
            email = data.get("email")
            password = data.get("password")
            age = data.get("age")
            billing_name = data.get("billing_name")
            billing_street_number = data.get("billing_street_number")
            billing_city = data.get("billing_city")
            billing_ZIP = data.get("billing_ZIP")
            billing_country = data.get("billing_country")

            #Creates a new user and saves it to the database
            new_user = User.objects.create(
                name=name,
                email=email,
                password=password,
                age=age,
                billing_name=billing_name,
                billing_street_number= billing_street_number,
                billing_city = billing_city,
                billing_ZIP = billing_ZIP,
                billing_country=billing_country
            )

            return JsonResponse({"message":"User succesfully created"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

#
#Stripe webhooks and functions
#

def create_stripe_customer(user):
    #Creates a stripe costumer
    customer = stripe.Customer.create(
        email = user.email,
        #Using billing information to send to stripe
        name = user.billing_name,
        address={
            "line1": user.billing_street_number,
            "city": user.billing_city,
            "postal_code": user.billing_ZIP,
            "country": user.billing_country,
        }
    )
    user.stripe_customer_id = customer.id
    user.save()
    return customer.id

#Creating a stripe checkout session and providing an url
def create_subsciption(user, price_id, success_url, cancel_url):
    session = stripe.checkout.Session.create(
        customer = user.stripe_customer_id,
        payment_method_types=["card"],
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=success_url,
        cancel_url=cancel_url,
    )
    return session.url

#Stripe webhook
@csrf_exempt
def stripe_webhook(req):
    payload = req.body
    sig_header = req.headers.get("Stripe-Signature")
    endpoint_secret = "webhook-secret"

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
    subscription = event["data"]["object"]
    subscription_costumer = subscription["costumer"]
    #Gets the subscripted user
    user = User.objects.get(stripe_costumer_id=subscription_costumer)
    #Subscription updated
    if event["type"] == "customer.subscription.updated":
        #Getting and updating the subscription
        my_subscription = user.stripe_subscription
        my_subscription.status = subscription["status"],
        my_subscription.current_period_end = datetime.fromtimestamp(subscription["current_period_end"])
        my_subscription.cancel_at_period_end = datetime.fromtimestamp(subscription["cancel_at_period_end"])
        my_subscription.current_period_start = datetime.fromtimestamp(subscription["current_period_start"])
        my_subscription.save()

    #New Subscription
    elif event["type"] == "customer.subscription.created":
        new_subscription = Subscription.objects.create(
            stripe_subscription_id = subscription["id"],
            status = subscription["status"],
            current_period_end = datetime.fromtimestamp(subscription["current_period_end"]),
            cancel_at_period_end = datetime.fromtimestamp(subscription["cancel_at_period_end"]),
            current_period_start = datetime.fromtimestamp(subscription["current_period_start"])
        )
        #Saves the subscription relation to the user
        user.stripe_subscription = new_subscription
        user.save()
    #Subscription deleted
    elif event["type"] == "customer.subscription.deleted":
        my_subscription = user.stripe_subscription
        my_subscription.status = 'canceled'
        my_subscription.save()
    
    #Payment succeeded, getting data by invoice webhook with subscription destructuring
    elif event['type'] == 'invoice.payment_succeeded':
        user.stripe_payment_method_id = subscription['payment_method']
        user.save()

    return JsonResponse({"status": "success"}, status=200)

# Method to update a users payment
def update_subscription_payment_method(user, payment_method_id):
    # Attach new payment method to the client
    stripe.PaymentMethod.attach(
        payment_method_id,
        customer=user.stripe_customer_id,
    )

    # Setting payment method to default
    stripe.Customer.modify(
        user.stripe_customer_id,
        invoice_settings={"default_payment_method": payment_method_id},
    )

    # Update subscription
    subscriptions = stripe.Subscription.list(customer=user.stripe_customer_id)
    for sub in subscriptions.auto_paging_iter():
        stripe.Subscription.modify(
            sub.id,
            default_payment_method=payment_method_id
        )
