from django.db import models
from django.utils import timezone


class Product(models.Model):

    product_name = models.CharField(max_length=200)
    seller = models.CharField(max_length=200)
    price = models.PositiveIntegerField()
    stock = models.PositiveIntegerField()
    description = models.CharField(max_length=10000,blank=True)
    googledocid  = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return "<{0}>".format(self.product_name)
