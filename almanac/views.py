from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.shortcuts import render, HttpResponse

from django.views.generic.edit import FormView
from django.contrib.auth.forms import AuthenticationForm
from almanac.form import UserRegForm, UserAuthForm


class RegForm(FormView):
    template_name = 'register.html'
    form_class =  UserRegForm
    success_url = '/'
    # def form_valid(self, form):
    #     print(form.data)
    #     CustomUser.objects.create_user(
    #         username=form.data.get('username'),
    #         email=form.data.get('email'),
    #         password=form.data.get('password')
    #     )
    #     print(123)
    #     return HttpResponseRedirect('/')

# Create your views here.
class AuthForm(LoginView):
    template_name = 'auth.html'
    form_class =  UserAuthForm

    def get_success_url(self):
        return '/'


def test(request):

    return render(request, 'base.html', {})