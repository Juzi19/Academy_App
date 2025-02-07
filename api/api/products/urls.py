from django.urls import path
from . import views

#URL Config for the api's users endpoint

urlpatterns = [
    path ('new/', views.new),
    path('new/<int:id>', views.product_id),
    path('saved/<int:id>', views.saved_product),
    path('allsaved/', views.allsaved),
    path('all/', views.getall),
    path('search/<str:search_name>', views.search_name),
    path('start/', views.start_information)
    
]