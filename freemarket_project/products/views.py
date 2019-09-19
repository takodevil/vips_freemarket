from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template.response import TemplateResponse
from django.shortcuts import render, redirect
from . import forms
import json
from . import Crypt
from .send_mail import send_mail
from django.contrib import messages

def product_list(request):
    """ 商品一覧
    """
    if request.method == 'POST':
        # json文字列で商品の全データを受け取る
        products = json.loads(request.POST['prm'])
        # ページネーション
        page = request.GET.get('page', 1)
        paginator = Paginator(products, 10)
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
    """ 購入画面
    """
    if request.method == 'POST':
        # POSTされてきたパラメータをセット
        params = {
            'apply_flag': request.POST['apply_flag'],
            'seller_addr': request.POST['seller_addr'],
            'seller_name': request.POST['seller_name'],
            'seller_mail': request.POST['seller_mail'],
            'buyer_addr': request.POST['buyer_addr'],
            'buyer_name': request.POST['buyer_name'],
            'buyer_mail': request.POST['buyer_mail'],
            'product_no': request.POST['product_no'],
            'product_name': request.POST['product_name'],
            'product_price': request.POST['product_price'],
            'product_stock': request.POST['product_stock'],
            'product_description': request.POST['product_description'],
            'ordercount': request.POST['ordercount']
        }
        # 住所とgmailのパスワードを復号して読み込み
        with open('params.txt', mode="r") as f:
            data = f.read()
        lines = data.split('^')
        for line in lines:
            if line:
                crypted_str_key = line.split(':')
                crypted_str = crypted_str_key[0]
                key = crypted_str_key[1]
                # 16進文字列に変換して保存しているので元のバイナリに戻す
                crypted_str = bytes.fromhex(crypted_str)
                key = bytes.fromhex(key)
                decrypt_result = Crypt.Decrypt(crypted_str, key)
                result = json.loads(decrypt_result)
                # 購入者の現在のVIPSアドレスと一致するものを探す
                if result["vips_address"] == params["buyer_addr"]:
                    params["emailpassword"] = result['emailpassword']
                    params["shipping_address"] = result['shipping_address']
                    # 見つかったらループを抜ける
                    break

        if request.POST['apply_flag'] == "1":
            # 事前確認ボタンの場合
            # メール送信してリダイレクト先のlist.htmlで結果メッセージを表示
            try:
                send_mail(params)
                messages.success(request, '出品者に事前確認メールを送信しました。')
            except:
                messages.error(request, '出品者への事前確認メール送信に失敗しました。')
            return redirect('products:list')
        else:
            # 購入ボタンの場合
            try:
                send_mail(params)
                messages.success(request, '出品者に購入通知メールを送信しました。')
            except:
                messages.error(request, '出品者への購入通知メール送信に失敗しました。')

            return redirect('products:list')

    else:
        # GETの場合はProductBuyingFormを表示
        if "id" in request.GET:
            id = request.GET.get("id")

        form = forms.ProductBuyingForm()

        return TemplateResponse(request, 'buy.html',
                                {'form': form,
                                 'id':id})

def product_transact(request):
    """ 取引一覧
    """
    if request.method == 'POST':
        # json文字列で取引の全データを受け取る
        transacts = json.loads(request.POST['prm'])
        # ページネーション
        page = request.GET.get('page', 1)
        paginator = Paginator(transacts, 2)
        try:
            transacts = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            transacts = paginator.page(1)
        return TemplateResponse(request, 'transact.html', {'transacts': transacts})
    else:
        return TemplateResponse(request, 'gettransact.html')

def product_eval(request):
    """ 評価とレビュー
    """
    if request.method == 'POST':
        return TemplateResponse(request, 'gettransact.html')
    else:
        tx_hash = request.GET.get("tx_hash")
        item_id = request.GET.get("item_id")
        buyerAddr = request.GET.get("buyerAddr")
        sellerAddr = request.GET.get("sellerAddr")
        buyertoseller = request.GET.get("buyertoseller")

    return TemplateResponse(request, 'eval.html',
                            {
                                'tx_hash': tx_hash,
                                'item_id': item_id,
                                'buyerAddr': buyerAddr,
                                'sellerAddr': sellerAddr,
                                'buyertoseller': buyertoseller
                            })
