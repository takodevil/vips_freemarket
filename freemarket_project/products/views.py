from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template.response import TemplateResponse
from . import forms
import json

def product_list(request):
    """ 商品一覧
    """
    if request.method == 'POST':
        # json文字列で商品の全データを受け取る
        products = json.loads(request.POST['prm'])
        # ページネーション
        page = request.GET.get('page', 1)
        paginator = Paginator(products, 5)
        try:
            products = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            products = paginator.page(1)
        return TemplateResponse(request, 'list.html', {'products': products})

    else:
        # getなら強制的にPOST
        # 一旦getproduct.htmlに投げる（ヘッダ部分だけの表示）
        # すると読み込んだ時点で自動的にgetproduct_contract.jsを読み込む
        # セッションストレージまたはコントラクトから商品データを読み込んで
        # getItems_formのhiddenパラメータにセットしてsubmitする
        # するとこの関数がPOSTで実行される
        return TemplateResponse(request, 'getproduct.html')

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
                # コントラクトが更新されるので情報を再取得する
                return TemplateResponse(request, 'list.html')

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

def product_edit(request):
    """出品中の商品の編集画面
    """
    if "id" in request.GET:
        id = request.GET.get("id")

    if request.method == 'POST':
        if 'confirmed' in request.POST:
            # 2回目の場合は出品する商品をコントラクトに保存する
            form = forms.ProductSellingForm(request.POST)
            if form.is_valid():
                # コントラクトが更新されるので情報を再取得する
                # 直後はgetで来る
                return TemplateResponse(request, 'list.html')

        # 1回目の場合は確認画面とフォームを再度表示
        form = forms.ProductSellingForm(request.POST)
        if form.is_valid():
            # DBは一時的な保存場所として使うのでcommitする必要はない
            # formをそのまま使うと再びformフィールドになって入力できてしまうので一旦productに移してから送信する
            product = form.save(commit=False)
            return TemplateResponse(request, 'edit_confirm.html',
                                    {'form': form,
                                     'product': product,
                                     'id': id})
    else:
        # GETの場合やバリデーションに失敗した場合はProductSellingFormを表示
        form = forms.ProductSellingForm()

    return TemplateResponse(request, 'edit.html',
                            {'form': form,
                             'id':id})

def product_buy(request):
    """ 購入申請画面
    """
    if "id" in request.GET:
        id = request.GET.get("id")

    if request.method == 'POST':
        form = forms.ProductBuyingForm(request.POST)
        if form.is_valid():
            # コントラクトが更新されるので情報を再取得する
            # 直後はgetで来る
            return TemplateResponse(request, 'list.html')

    else:
        # GETの場合やバリデーションに失敗した場合はProductBuyingFormを表示
        form = forms.ProductBuyingForm()

    return TemplateResponse(request, 'buy.html',
                            {'form': form,
                             'id':id})

