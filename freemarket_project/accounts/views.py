from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render, redirect
from django.template.response import TemplateResponse
from .forms import SignUpForm, ModifyForm, LoginForm
from django.http import HttpResponse
from .mailtest import mailtest
import json
from . import Crypt
import os

def login(request):
    if request.method == 'POST':
        # login_contract.jsの処理が成功している
        return redirect('products:list')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout(request):
    return redirect('products:list')

def signup(request):
    if request.method == 'POST':
        # 「メールアドレスの確認」を押した場合は画面遷移せずにメール送信のテストを行なう
        if 'mailtest_flag' in request.POST:
            try:
                test_emailaddress = request.POST['test_emailaddress']
                test_emailpassword = request.POST['test_emailpassword']
                mailtest(test_emailaddress,test_emailpassword)
                return HttpResponse('メールを送信しました。受信できていることを確認してOKボタンを押してください')
            except:
                return HttpResponse('メール送信に失敗しました。')
        else:
            # signup_contract.jsの処理が成功しているのでgmailパスワードと発送先住所を保存する
            param_emailpassword = request.POST['param_emailpassword']
            param_shipping_address = request.POST['param_shipping_address']
            # 複垢の場合を考慮
            param_vips_address = request.POST['param_vips_address']
            param = {"emailpassword": param_emailpassword,
                     "shipping_address": param_shipping_address,
                     "vips_address": param_vips_address}
            param = json.dumps(param)
            # 一応暗号化処理
            crypted_str, key = Crypt.Encrypt(param)
            crypted_str = crypted_str.hex()
            key = key.hex()
            result = '^' + crypted_str + ':' + key
            with open('params.txt', mode='a') as f:
                f.write(result)
            return redirect('products:list')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def modify_account(request):
    if request.method == 'POST':
        # 「メールアドレスの確認」を押した場合は画面遷移せずにメール送信のテストを行なう
        if 'mailtest_flag' in request.POST:
            try:
                test_emailaddress = request.POST['test_emailaddress']
                test_emailpassword = request.POST['test_emailpassword']
                mailtest(test_emailaddress,test_emailpassword)
                return HttpResponse('メールを送信しました。受信できていることを確認してOKボタンを押してください')
            except:
                return HttpResponse('メール送信に失敗しました。')
        else:
            # modify_contract.jsの処理が成功しているのでgmailパスワードと発送先住所を保存する
            param_emailpassword = request.POST['param_emailpassword']
            param_shipping_address = request.POST['param_shipping_address']
            param_vips_address = request.POST['param_vips_address']
            # 既存のデータをすべて読み込み、VIPSアドレスをキーにして更新をかける
            with open('params.txt', mode="r") as f:
                data = f.read()
            lines = data.split('^')
            results = []
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
                    # 現在のVIPSアドレスと一致したら上書き
                    if result["vips_address"] == param_vips_address:
                        result['emailpassword'] = param_emailpassword
                        result['shipping_address'] = param_shipping_address
                    results.append(result)
            # 一旦削除して上書きしたデータですべて書き直す
            os.remove('params.txt')
            for result in results:
                param = json.dumps(result)
                crypted_str, key = Crypt.Encrypt(param)
                a = crypted_str.hex()
                b = key.hex()
                c = '^' + a + ':' + b
                with open('params.txt', mode='a') as f:
                    f.write(c)
            return redirect('products:list')

    else:
        form = ModifyForm()
        # 住所とgmailのパスワードを復号して読み込み
        with open('params.txt', mode="r") as f:
            data = f.read()
        lines = data.split('^')
        results = []
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
                # アカウントが複数ある場合
                results.append(result)

        return render(request, 'modify_account.html', {'form': form,'results':results})

def user_list(request):
    """ユーザ一覧
    """
    if request.method == 'POST':
        # json文字列で取引の全データを受け取る
        params = json.loads(request.POST['prm'])
        # ページネーション
        page = request.GET.get('page', 1)
        paginator = Paginator(params, 10)
        try:
            user_lists = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            user_lists = paginator.page(1)
        return TemplateResponse(request, 'user_list.html', {'user_lists': user_lists})
    else:
        return TemplateResponse(request, 'getuser.html')

def ban_history(request):
    """BAN履歴
    """
    if request.method == 'POST':
        # json文字列で取引の全データを受け取る
        params = json.loads(request.POST['prm'])
        # ページネーション
        page = request.GET.get('page', 1)
        paginator = Paginator(params, 10)
        try:
            ban_histories = paginator.page(page)
        except (EmptyPage, PageNotAnInteger):
            ban_histories = paginator.page(1)
        return TemplateResponse(request, 'ban_history.html', {'ban_histories': ban_histories})
    else:
        return TemplateResponse(request, 'getban_history.html')
