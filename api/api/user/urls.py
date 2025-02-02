from django.urls import path
from . import views

#URL Config for the api's users endpoint

urlpatterns = [
    path ('new/subscription/', views.subscribe),
    path('new', views.create_user),
    path('new/confirm-email/', views.confirm_email),
    path ('settings/updatepayment/', views.update_payment),
    path('invoices/', views.get_customer_invoices),
    path('check-credentials/', views.check_credentials),
    path('settings/personal', views.settings_personal),
    path('settings/password-forget', views.password_forget),
    path('isadmin/', views.check_admin)
]