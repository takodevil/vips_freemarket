from django.urls import path

from . import views


app_name = 'products'
urlpatterns = [
    path('', views.product_list, name='list'),
    path('top', views.top, name='top'),
    path('sell', views.product_sell, name='sell'),
    path('buy/<int:product_id>/', views.product_buy, name='buy'),
]
