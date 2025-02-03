from django.db import models
from products.models import Product

#Subscription details, to approve subsciptions/payments and give access
class Subscription(models.Model):
    stripe_subscription_id = models.CharField(max_length=50, unique=True)
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

#User model
class User(models.Model):
    #Personal user information
    name = models.CharField(blank=False, max_length=100)
    email = models.EmailField(blank=False, unique=True)
    age = models.DateField(blank=False)
    email_pin = models.IntegerField(blank=True, null=True)
    email_confirmed = models.BooleanField(default=False)
    password = models.CharField(max_length=128)
    password_valid = models.BooleanField(default=True)
    #For password resets
    admin = models.BooleanField(default=False)

    #Billing adress information
    billing_name = models.CharField(default='', max_length=100)
    billing_street_number = models.CharField(default='', max_length=100)
    billing_city = models.CharField(default='', max_length=100)
    billing_ZIP = models.CharField(default='', max_length=10)
    billing_country = models.CharField(default='', max_length=100)

    #There are relations from the products to the user
    prev_viewed = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True, related_name='user_prev_viewed')
    #Products saved by the user
    saved = models.ManyToManyField(Product, blank=True)
    
    stripe_subscription = models.OneToOneField(Subscription, on_delete=models.SET_NULL,null=True, default=None, blank=True)  
    
    stripe_customer_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    stripe_payment_method_id = models.CharField(max_length=50, blank=True, null=True)

