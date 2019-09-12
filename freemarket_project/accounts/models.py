from django.db import models
from django import forms

class Account(models.Model):

    username = models.CharField(max_length=254, blank=False)
    email_address = models.CharField(max_length=254, blank=False)
    vipstarcoin_address = models.CharField(max_length=254, blank=False)

    def __str__(self):
        return self.username
