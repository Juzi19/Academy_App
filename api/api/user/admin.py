from django.contrib import admin
from .models import Subscription, User
from products.models import Product
from django.contrib.auth.hashers import make_password

# Subscription model in the admin
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('stripe_subscription_id', 'status', 'current_period_start', 'current_period_end', 'cancel_at_period_end')
    search_fields = ('stripe_subscription_id', 'status')
    list_filter = ('status', 'cancel_at_period_end')
    date_hierarchy = 'current_period_start'

# User model in the admin
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'age', 'email_confirmed', 'admin', 'stripe_customer_id')
    search_fields = ('name', 'email', 'stripe_customer_id')
    list_filter = ('email_confirmed', 'admin')
    readonly_fields = ('stripe_customer_id', 'stripe_payment_method_id')
    
    def prev_viewed_products(self, obj):
        return str(obj.prev_viewed) if obj.prev_viewed else "None"
    prev_viewed_products.short_description = "Previously Viewed Product"

    def saved_products(self, obj):
        return str(obj.saved) if obj.saved else "None"
    saved_products.short_description = "Saved Product"

    # Override save_model to hash password before saving
    def save_model(self, request, obj, form, change):
        if obj.password:  # Check if password is being set
            obj.password = make_password(obj.password)  # Hash the password
        super().save_model(request, obj, form, change)

    # Adding custom methods to show these fields in the admin interface
    list_display += ('prev_viewed_products', 'saved_products')

# Register models with the admin site
admin.site.register(Subscription, SubscriptionAdmin)
admin.site.register(User, UserAdmin)
