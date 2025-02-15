from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=False)
    #Image to describe the product better
    image = models.ImageField(blank=False, upload_to='images/')
    #Resource that will be shared
    file = models.FileField(blank=False, upload_to='files/')
