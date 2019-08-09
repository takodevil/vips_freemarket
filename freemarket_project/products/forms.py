from django import forms

from . import models

class ProductSellingForm(forms.ModelForm):
    class Meta:
        model = models.Product
        fields = (
            'product_name',
            'seller',
            'price',
            'stock',
            'googledocid'
        )

class ProductBuyingForm(forms.ModelForm):
    class Meta:
        model = models.Product
        fields = (
            'product_name',
            'seller',
            'price',
            'stock',
            'googledocid'
        )
