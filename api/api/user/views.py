from django.shortcuts import render, get_object_or_404
import stripe
from .models import User, Subscription
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import datetime
import random
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
import secrets
import string


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
            
            #Checks if email is unique
            check_user = User.objects.filter(email=email)
            if(check_user.exists()):
                return JsonResponse({"message": "Please enter another email adress"}, status = 400)

            #Creates a new user and saves it to the database
            new_user = User.objects.create(
                name=name,
                email=email,
                password=make_password(password),
                age=age,
                billing_name=billing_name,
                billing_street_number= billing_street_number,
                billing_city = billing_city,
                billing_ZIP = billing_ZIP,
                billing_country=billing_country
            )

            #Sends account confirmation to the users email address
            send_conf_email(new_user)

            return JsonResponse({"message":"User succesfully created"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


#Creates a new user
def confirm_email(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            pin = data.get("pin")
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #If user input in correct
            if(check_password(pin, user.email_pin)):
                #Confirms email address
                user.email_confirmed = True
                user.save()
                return JsonResponse({"message":"Email confirmed"})
            else:
                return JsonResponse({"message":"Incorrect pin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

#Checks User login credentials
def check_credentials(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            password = data.get("password")
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #If user input in correct
            if(check_credentials(password, user.password) and user.password_valid==False):
                return JsonResponse({
                    "login": True,
                    "message": "Redirecting to change password to a safe one"         
                    }, status=300)
            elif(check_password(password, user.password)):
                return JsonResponse({"login":True}, status=200)
            else:
                return JsonResponse({"login":False}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)

#Checks if user is an admin
def check_admin(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #If user input in correct
            if(user.admin):
                return JsonResponse({
                    "admin": True,
                    }, status=200)
            else:
                return JsonResponse({"admin":False}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


#updates personal settings
def settings_personal(req):
    if req.method == 'GET':
        #Sending user information
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Email can't be changed, since it is unsafe and saved in stripe for invoices
            return JsonResponse({
                "name":user.name,
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    if req.method == 'PUT':
    #Sending user information
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            name = data.get("name")
            password = data.get("password")
            previous_passwort = data.get("previous_password")
            user = get_object_or_404(User, id=user_id)
            #change password if user entered a new one
            if(password != '' or password != None):
                if(previous_passwort == '' or previous_passwort == None or check_password(previous_passwort, user.password) == False):
                    return JsonResponse({"message": "please enter your current password to get a new one"})
                else:
                    #If User input the correct password
                    user.password = make_password(password)
                    user.password_valid = True
            
            if(name != '' or name != None):
                user.name = name
            
            #Saves changes to the user
            user.save()
            return JsonResponse({}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def password_forget(req):
    if req.method == 'POST':
    #Sending user information
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            email = data.get("email")
            user = User.objects.filter(User, email=email)
            #Change password if user exists
            if(user.exists()):
                otp = generate_one_time_password()
                user.password = make_password(otp)
                send_mail(
                    subject="Passwort Wiederherstellung",
                    message=f'Sie erhalten hier Ihr Einmalpasswort um den Account wiederherstellen zu können:{otp}',
                    from_email="noreply@example.com",
                    to=[user.email]
                )
                user.password_valid = False
                #Saves changes to the user
                user.save()
            return JsonResponse({}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

#
#Stripe webhooks and functions
#

#Sends a confirmation email to the user
def send_conf_email(user):
    pin = random.randint(1000,9999)
    user.email_pin = make_password(pin)
    user.save()
    send_mail(
        subject="Willkommen bei der Academy App",
        message=f'Wir freuen uns sehr über Ihre Anmeldung. Um fortzufahren geben Sie bitte folgende Pin ein: {pin}',
        from_email="noreply@example.com",
        to=[user.email]
    )

def generate_one_time_password(length=20):
    characters = string.ascii_letters + string.digits  # Buchstaben (A-Z, a-z) + Zahlen (0-9)
    return ''.join(secrets.choice(characters) for _ in range(length))

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
        #User gets emails automatically from stripe
        customer_email=user.email
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
