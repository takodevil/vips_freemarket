from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import get_object_or_404, redirect
from django.template.response import TemplateResponse
from . import models
from . import forms
import json

def product_list(request):
    """ 商品一覧画面
    """
    # json文字列で商品の全データを受け取る
    if request.method == 'POST':
        product_info = json.loads(request.POST['prm'])
        return TemplateResponse(request, 'list.html', {'product_info': product_info})
    # 書き換える予定
    products = models.Product.objects.all()
    paginator = Paginator(products, 5)
    page = request.GET.get('page', 1)
    try:
        products = paginator.page(page)
    except (EmptyPage, PageNotAnInteger):
        products = paginator.page(1)
    return TemplateResponse(request, 'list.html', {'products':products})

def product_sell(request):
    """ 出品画面・確認画面・出品
    """
    # メソッドが GET の場合は ProductSellingForm を表示（テンプレートは sell.html ）
    # 1度目の POST で入力が正しい場合、確認画面とフォームを再度表示（テンプレートは sell_confirm.html）
    # 確認画面からの2度目の POST で入力が正しい場合、商品を作成する⇒sell_confirm.htmlのボタンを押下した時にコントラクトに保存する

    # POSTが1度目か2度目かはどうやって判断すればいい？
    # 確認画面sell_confirm.htmlから来ていれば2回目のはず
    # confirm.htmlには
    # <input type="hidden" name="confirmed" value="1">とあるように
    # confirmedの隠し要素があるのでこれで判定する

    if request.method == 'POST':
        if 'confirmed' in request.POST:
            # 2回目の場合は出品する商品をコントラクトに保存する
            form = forms.ProductSellingForm(request.POST)
            if form.is_valid():
                return redirect('products:list')
        # 1回目の場合は確認画面とフォームを再度表示
        form = forms.ProductSellingForm(request.POST)
        if form.is_valid():
            # DBは一時的な保存場所として使うのでcommitする必要はない
            # formをそのまま使うと再びformフィールドになって入力できてしまうので一旦productに移してから送信する
            product = form.save(commit=False)
            return TemplateResponse(request, 'sell_confirm.html',
                                    {'form': form,
                                     'product': product})
    else:
        # GETの場合やバリデーションに失敗した場合はProductSellingFormを表示
        form = forms.ProductSellingForm()

    return TemplateResponse(request, 'sell.html',
                        {'form': form})

def product_buy(request, product_id):
    """ 購入確認画面
    """
    product = get_object_or_404(models.Product, id=product_id)
    form = forms.ProductBuyingForm()

    return TemplateResponse(request, 'buy_confirm.html',
                        {'form': form,
                         'product':product})