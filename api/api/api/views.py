from django.http import HttpResponse

def start(req):
    return HttpResponse('<h1> Server is up and running<h1/>')