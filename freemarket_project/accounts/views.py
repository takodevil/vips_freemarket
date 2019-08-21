from django.shortcuts import render, redirect
from .forms import SignUpForm, ModifyForm, LoginForm

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
        form = SignUpForm(request.POST)
        if form.is_valid():
            return redirect('products:list')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def modify_account(request):
    if request.method == 'POST':
        form = ModifyForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('products:list')
    else:
        form = ModifyForm()
    return render(request, 'modify_account.html', {'form': form})

