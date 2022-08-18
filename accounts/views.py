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
from accounts.models import Country


class RegForm(CreateView):
    template_name = 'register.html'
    form_class =  UserRegForm
    success_url = '/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['countries'] = Country.objects.all()
        return  context
    def form_valid(self, form):
        self.object = form.save()
        login(self.request, self.object, backend='django.contrib.auth.backends.ModelBackend')
        return HttpResponseRedirect(reverse_lazy('start', kwargs={'slug': self.object.username}))


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
