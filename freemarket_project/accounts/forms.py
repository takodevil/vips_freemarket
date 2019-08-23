from django import forms
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class LoginForm(forms.Form):
    vipstarcoin_address = forms.CharField(max_length=254, required=True, widget=forms.TextInput())

    class Meta:
        fields = ('vipstarcoin_address',)

class SignUpForm(forms.Form):
    username = forms.CharField(max_length=254, required=True, widget=forms.TextInput())
    email_address = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    vipstarcoin_address = forms.CharField(max_length=254, required=True, widget=forms.TextInput())

    class Meta:
        fields = ('username', 'email_address', 'vipstarcoin_address')

    def clean_email(self):
        email = self.cleaned_data["email_address"]
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError("正しいメールアドレスを指定して下さい。")

class ModifyForm(forms.Form):
    username = forms.CharField(max_length=254, required=True, widget=forms.TextInput())
    email_address = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())

    class Meta:
        fields = ('username', 'email_address')

    def clean_email(self):
        email = self.cleaned_data["email_address"]
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError("正しいメールアドレスを指定して下さい。")

