from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class SignUpForm(UserCreationForm):
    email_address = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    vipstarcoin_address = forms.CharField(max_length=254, required=True, widget=forms.TextInput())

    class Meta:
        model = User
        fields = ('username', 'email_address', 'vipstarcoin_address', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data["email_address"]
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError("正しいメールアドレスを指定して下さい。")

class ModifyForm(forms.ModelForm):
    email_address = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    vipstarcoin_address = forms.CharField(max_length=254, required=True, widget=forms.TextInput())

    def __init__(self, *args, **kwargs):
        self.user = kwargs.get('instance', None)
        super().__init__(*args, **kwargs)

    class Meta:
        model = User
        fields = ('username', 'email_address', 'vipstarcoin_address')

    def clean_email(self):
        email = self.cleaned_data["email_address"]

        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError("正しいメールアドレスを指定してください。")

