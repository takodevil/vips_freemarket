from django.shortcuts import render, redirect
from .forms import SignUpForm, ModifyForm, LoginForm
from django.http import HttpResponse
from .mailtest import mailtest

def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
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
                return HttpResponse('メールを送信しました。受信できていることを確認してください')
            except:
                return HttpResponse('メール送信に失敗しました。')
        else:
            # signup_contract.jsの処理が成功しているのでgmailパスワードと発送先住所を保存する
            return redirect('products:list')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def modify_account(request):
    if request.method == 'POST':
        form = ModifyForm(request.POST)
        if form.is_valid():
            return redirect('products:list')
    else:
        form = ModifyForm()
    return render(request, 'modify_account.html', {'form': form})

