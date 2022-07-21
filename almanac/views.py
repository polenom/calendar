from django.contrib.auth.models import User
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import ListView
from accounts.models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()


class StartPage(ListView):
    template_name = 'main.html'
    model = CustomUser

class AuthJS(ListView):
    template_name = 'jsauth.html'
    model = CustomUser


def one(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('start', kwargs={'slug': request.user.username}))
    return render(request, 'base.html', {})

