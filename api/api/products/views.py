from django.shortcuts import get_object_or_404
import json
from django.http import JsonResponse
from user.models import User
from .models import Product
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def new(req):
    if req.method == 'POST':
        if 'file' in req.FILES and 'img' in req.FILES:
            try:
                user_id = req.POST.get('user_id')
                user = get_object_or_404(User, id=user_id)
                #Only admins can create new products
                if(user.admin):
                    name = req.POST.get("name")
                    description = req.POST.get("description")
                    uploaded_file = req.FILES["file"]
                    image = req.FILES["img"]
                    #Creates a new Product
                    Product.objects.create(
                        name=name,
                        description=description,
                        image=image,
                        file=uploaded_file
                    )
                    return JsonResponse({"message": "Product successfully created"}, status=200)
                else:
                    return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
            
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON"}, status=400)
        else:
             return JsonResponse({"error": "Both 'file' and 'img' must be provided."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def product_id(req, id):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = get_object_or_404(Product, id=id)
                #User remeberes previously viewed product
                user.prev_viewed = product
                #Shows whether product is saved
                saved = user.saved.contains(product)
                user.save()
                return JsonResponse({
                    "name":product.name,
                    "description": product.description,
                    "image_url": product.image.url,
                    "file_url": product.file.url,
                    "saved": saved
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
                print("Produktid", id)
                product.delete()
                return JsonResponse({
                    "message": "Product deleted"
                }, status=200)
            else:
                return JsonResponse({'message': "Access denied, you're not an admin"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def getall(req):
    if req.method == 'POST':
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
 

@csrf_exempt
def saved_product(req):
    #Adding a product to the subscribed products
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            id = data.get("id")
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
            id = data.get("id")
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
@csrf_exempt
def allsaved(req):
    if req.method == 'POST':
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
@csrf_exempt
def search_name(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            search_name = data.get("search_name")
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

@csrf_exempt
def start_information(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body.decode("utf-8"))#parse json data
            user_id = data.get("user_id")
            user = get_object_or_404(User, id=user_id)
            #Only subscibed users can create new products
            if(user_subscribed(user)):
                product = user.saved.all()
                #response already including the previously viewed product
                response = []
                if(user.prev_viewed):
                    response = [[user.prev_viewed.name,user.prev_viewed.id,user.prev_viewed.image.url, user.prev_viewed.description]]
                for p in product:
                    response.append([p.name,p.id, p.image.url, p.description])

                return JsonResponse({
                    "products":response,
                    "username": user.name,
                    "subscribed": user_subscribed(user),
                    "email": user.email_confirmed
                }, status=200)
            
            else:
                return JsonResponse({'message': "Access denied, you're not subscribed"}, status=403)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


#User either has a stripe subsciption or is admin
def user_subscribed(user)->bool:
    if(user.admin or user.stripe_subscription.status == 'active' or user.stripe_subscription.status == 'Active'):
        return True
    return False