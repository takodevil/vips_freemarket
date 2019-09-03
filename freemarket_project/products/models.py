from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Product(models.Model):

    product_name = models.CharField(max_length=200)
    seller = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    description = models.TextField(max_length=10000,blank=True)
    image_uri  = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return "<{0}>".format(self.product_name)
