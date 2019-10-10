from django import forms

from . import models

class ProductSellingForm(forms.ModelForm):
    class Meta:
        model = models.Product
        fields = (
            'product_name',
            'price',
            'stock',
            'description',
            'image_uri',
        )
# 定義が同じなので意味がないが修正するのが面倒なのでそのまま
class ProductBuyingForm(forms.ModelForm):
    class Meta:
        model = models.Product
        fields = (
            'product_name',
            'price',
            'stock',
            'description',
            'image_uri',
        )
