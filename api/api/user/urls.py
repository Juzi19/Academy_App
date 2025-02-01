from django.urls import path
from . import views

#URL Config for the api's users endpoint

urlpatterns = [
    path ('new/subscription', views.subscribe),
    path('new', views.create_user),
    path ('settings/updatepayment', views.update_payment),
    path('invoices', views.get_customer_invoices)
]