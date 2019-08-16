from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from . import models
from . import forms
from django.contrib.auth.decorators import login_required

def product_list(request):
    """ 商品一覧画面
    """
    products = models.Product.objects.all()
    paginator = Paginator(products, 5)
    page = request.GET.get('page', 1)
    try:
        products = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        products = paginator.page(1)
    return TemplateResponse(request, 'list.html', {'products':products})

@login_required
def product_sell(request):
    """ 出品画面・確認画面・出品
    """
    # メソッドが GET の場合は ProductSellingForm を表示（テンプレートは sell.html ）
    # 1度目の POST で入力が正しい場合、確認画面とフォームを再度表示（テンプレートは sell_confirm.html）
    # 確認画面からの2度目の POST で入力が正しい場合、商品を作成する

    # POSTが1度目か2度目かはどうやって判断すればいい？
    # 確認画面sell_confirm.htmlから来ていれば2回目のはず
    # confirm.htmlには
    # <input type="hidden" name="confirmed" value="1">とあるように
    # confirmedの隠し要素があるのでこれで判定する

    if request.method == 'POST':
        if 'confirmed' in request.POST:
            # 2回目の場合は出品するチケットを作成する
            form = forms.ProductSellingForm(request.POST)
            if form.is_valid():
                product = form.save(commit=False)
#                product.seller = request.user
                product.save()
                return redirect('products:list')
        # 1回目の場合は確認画面とフォームを再度表示
        form = forms.ProductSellingForm(request.POST)
        if form.is_valid():
            product = form.save(commit=False)
            return TemplateResponse(request, 'sell_confirm.html',
                                    {'form': form,
                                     'product': product})
    else:
        # GETの場合やバリデーションに失敗した場合はProductSellingFormを表示
        form = forms.ProductSellingForm()

    return TemplateResponse(request, 'sell.html',
                        {'form': form})
@login_required
def product_buy(request, product_id):
    """ 購入確認画面
    """
    product = get_object_or_404(models.Product, id=product_id)
    form = forms.ProductBuyingForm()

    return TemplateResponse(request, 'buy_confirm.html',
                        {'form': form,
                         'product':product})