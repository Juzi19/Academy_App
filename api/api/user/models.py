from django.db import models
from products.models import Product

#User model
class User(models.model):
    #Personal user information
    first_name = models.CharField(blank=False, max_length=100)
    last_name = models.CharField(blank=False, max_length=100)
    email = models.EmailField(blank=False)
    email_pin = models.IntegerField(blank=True)
    email_confirmed = models.BooleanField(default=False)
    password = models.CharField(max_length=128)
    #For password resets
    password_restore = models.CharField(max_length=128, blank=True)
    password_restore_valid = models.DateTimeField(blank=True)
    admin = models.BooleanField(default=False)

    #Billing adress information
    billing_first_name = models.CharField(default='', max_length=100)
    billing_last_name = models.CharField(default='', max_length=100)
    billing_street = models.CharField(default='', max_length=100)
    billing_number = models.CharField(default='', max_length=10)
    billing_ZIP = models.CharField(default='', max_length=10)
    billing_country = models.CharField(default='', max_length=100)

    #There are relations from the products to the user
    prev_viewed = models.ForeignKey(Product, on_delete=models.CASCADE, blank=True)
    #Products saved by the user
    saved = models.ManyToManyField(Product, blank=True)
    #Products viewed by the User
    viewed = models.ManyToManyField(Product, blank=True)

#Costumer reference to stripe costumer
class StripeCustomer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, unique=True)
    stripe_payment_method_id = models.CharField(max_length=50, blank=True, null=True)

#Subscription details, to approve subsciptions/payments and give access
class Subscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    stripe_subscription_id = models.CharField(max_length=50, unique=True)
    stripe_price_id = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
        ('trialing', 'Trialing'),
    ])
    cancel_at_period_end = models.BooleanField(default=False)
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()