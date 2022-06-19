from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.shortcuts import render, HttpResponse
from django.urls import reverse_lazy, reverse

from django.views.generic.edit import FormView, CreateView
from django.contrib.auth.forms import AuthenticationForm
from accounts.form import UserRegForm, UserAuthForm
from almanac.models import UserAdvance


class RegForm(CreateView):
    template_name = 'register.html'
    form_class =  UserRegForm
    success_url = '/'

    def form_valid(self, form):
        self.object = form.save()
        UserAdvance.objects.create(
            user_id=self.object.pk
        )
        return HttpResponseRedirect( reverse_lazy('start', kwargs={'slug': self.object.username}))


class AuthForm(LoginView):
    template_name = 'auth.html'
    form_class =  UserAuthForm

    def get_success_url(self):
        path = reverse('start', kwargs={'slug': self.request.user.username})
        print(path)
        return path

def logou(request):
    if request.user.is_authenticated:
        logout(request)
    return HttpResponseRedirect('/')
