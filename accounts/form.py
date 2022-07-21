import copy

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
# from django.contrib.auth.models import User
from accounts.models import CustomUser

User = get_user_model()


class UserRegForm(UserCreationForm):
    username = forms.CharField(label='Username', required=False, widget=forms.TextInput(
        attrs={'class': 'form-control', 'id': 'floatingInput', 'placeholder': 'username', 'required': 'True'}))
    email = forms.CharField(label='Email', required=False, widget=forms.EmailInput(
        attrs={'class': 'form-control', 'id': 'floatingEmail', 'placeholder': 'Email', 'required': 'True'}))
    password1 = forms.CharField(label='Password', required=False, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword1', 'placeholder': 'password', 'required': 'True'}))
    password2 = forms.CharField(label='Confim password', required=False, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword2', 'placeholder': 'password', 'required': 'True'}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')



class UserAuthForm(AuthenticationForm):
    username = forms.CharField(label='Username or email', widget=forms.TextInput(
        attrs={'class': 'form-control', 'id': 'floatingInput', 'placeholder': 'username or email'}))
    password = forms.CharField(label='Password', widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword', 'placeholder': 'password'}))

    def __init__(self, request=None, *args, **kwargs):
        if kwargs.get('data') and '@' in  kwargs.get('data').get('username') :
            self.kw = copy.deepcopy(kwargs)
            try:
                username = User.objects.get(email__iexact=kwargs['data']['username']).username
                self.kw['data']['username'] = username
            except User.DoesNotExist :
                pass
            super().__init__(request=None, *args, **self.kw)
        else:
            super().__init__(request=None, *args, **kwargs)