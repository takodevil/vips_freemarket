from django.urls import path

from . import views


app_name = 'products'
urlpatterns = [
    path('', views.product_list, name='list'),
    path('sell', views.product_sell, name='sell'),
    path('buy', views.product_buy, name='buy'),
    path('edit', views.product_edit, name='edit'),
    path('transact', views.product_transact, name='transact'),
    path('eval', views.product_eval, name='eval'),
]
