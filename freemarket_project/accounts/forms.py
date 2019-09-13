from django import forms

class LoginForm(forms.Form):
    vipstarcoin_address = forms.CharField(label="VIPSアドレス",max_length=254, required=True, widget=forms.TextInput())
    class Meta:
        fields = ('vipstarcoin_address',)

class SignUpForm(forms.Form):
    username = forms.CharField(label="ハンドルネーム（公開）※任意", max_length=254, required=False, widget=forms.TextInput())
    email_address = forms.CharField(label="gmailアドレス（公開）※必須", max_length=254, required=True, widget=forms.EmailInput())
    email_password = forms.CharField(label="gmailパスワード（非公開）※必須", max_length=254, required=True, widget=forms.PasswordInput())
    vipstarcoin_address = forms.CharField(label="VIPSアドレス（公開）※必須",max_length=254, required=True, widget=forms.TextInput())
    shipping_address = forms.CharField(label="発送先住所（相手の出品者にのみ公開）※任意",max_length=1000, required=False, widget=forms.Textarea())

    class Meta:
        fields = ('username', 'email_address', 'email_password', 'vipstarcoin_address', 'shipping_address')

class ModifyForm(forms.Form):
    username = forms.CharField(label="ハンドルネーム（公開）※任意", max_length=254, required=False, widget=forms.TextInput())
    email_address = forms.CharField(label="gmailアドレス（公開）※必須", max_length=254, required=True, widget=forms.EmailInput())
    email_password = forms.CharField(label="gmailパスワード（非公開）※必須", max_length=254, required=True, widget=forms.PasswordInput())
    shipping_address = forms.CharField(label="発送先住所（相手の出品者にのみ公開）※任意",max_length=1000, required=False, widget=forms.Textarea())

    class Meta:
        fields = ('username', 'email_address', 'email_password','shipping_address')
