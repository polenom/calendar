from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User


class UserRegForm(UserCreationForm):
    username = forms.CharField(label='Username', required=False, widget=forms.TextInput(
        attrs={'class': 'form-control', 'id': 'floatingInput', 'placeholder': 'username', 'required': 'True'}))
    email = forms.CharField(label='Email', required=False, widget=forms.EmailInput(
        attrs={'class': 'form-control', 'id': 'floatingEmail', 'placeholder': 'Email', 'required': 'True'}))
    password1 = forms.CharField(label='Password', required=False, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword', 'placeholder': 'password', 'required': 'True'}))
    password2 = forms.CharField(label='Confim password', required=False, widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword', 'placeholder': 'password', 'required': 'True'}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class UserAuthForm(AuthenticationForm):
    username = forms.CharField(label='Username', widget=forms.TextInput(
        attrs={'class': 'form-control', 'id': 'floatingInput', 'placeholder': 'username'}))
    password = forms.CharField(label='Password', widget=forms.PasswordInput(
        attrs={'class': 'form-control', 'id': 'floatingPassword', 'placeholder': 'password'}))