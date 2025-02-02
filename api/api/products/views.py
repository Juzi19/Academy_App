from django.shortcuts import render, get_object_or_404
import json
from django.http import JsonResponse
from user.models import User
from .models import Product

# Create your views here.
def new(req):
    if req.method == 'POST' and req.FILES.get("file") and req.FILES. get("image_description"):
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only admins can create new products
            if(user.admin):
                name = data.get("name")
                description = data.get("description")
                uploaded_file = req.FILES["file"]
                image = req.FILES["image_description"]
                #Creates a new Product
                Product.objects.create(
                    name=name,
                    description=description,
                    image=image,
                    file=uploaded_file
                )
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)


def product_id(req, id):
    if req.method == 'GET':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = get_object_or_404(Product, id=id)
                #User remeberes previously viewed product
                user.prev_viewed = product
                user.save()
                return JsonResponse({
                    "name":product.name,
                    "desciption": product.description,
                    "image_url": product.image.url,
                    "file_url": product.file.url
                })
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    #PUT method for admins to change the description (changing files is forbidden since user saved the product for a purpose)
    elif req.method == 'PUT':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            product_desciption = data.get("product_description")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user.admin):
                product = get_object_or_404(Product, id=id)
                #User remeberes previously viewed product
                product.description = product_desciption
                product.save()
                return JsonResponse({
                    "message":"Product updated"
                })
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    #Deletes a product if user is admin
    elif req.method == 'DELETE':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user.admin):
                product = get_object_or_404(Product, id=id)
                product.delete()
                return JsonResponse({
                    "message": "Product deleted"
                })
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


def getall(req):
    if req.method == 'GET':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = Product.objects.all()
                response = []
                for p in product:
                    response.append([p.name,p.id, p.image.url, p.description])

                return JsonResponse({
                    "products":response
                }, status=200)
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)
 


def saved_product(req, id):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = get_object_or_404(Product, id=id)
                user.saved.add(product)
                user.save()
                
                return JsonResponse({
                    "message":"Product saved"
                }, status=200)
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
   
    #Removing a product from the saved list
    if req.method == 'DELETE':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = get_object_or_404(Product, id=id)
                #Remove the product from the saved products
                user.saved.remove(product)
                user.save()
                return JsonResponse({
                    "message":"Product removed"
                }, status=200)
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

#Returning all the saved products for a user
def allsaved(req):
    if req.method == 'GET':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = user.saved.all()
                response = []
                for p in product:
                    response.append([p.name,p.id, p.image.url, p.description])

                return JsonResponse({
                    "products":response
                }, status=200)
            
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

#A simple search to search for products
def search_name(req, search_name):
    if req.method == 'GET':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = Product.objects.filter(name__icontains=search_name)
                response = []
                for p in product:
                    response.append([p.name,p.id, p.image.url, p.description])

                return JsonResponse({
                    "products":response
                }, status=200)
            
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

    


def user_subscribed(user)->bool:
    if(user.stripe_subscription.status == 'active' or user.admin):
        return True
    return False