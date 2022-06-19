from django.contrib.auth.models import User
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic import ListView


class StartPage(ListView):
    template_name = 'main.html'
    model = User




def one(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('start', kwargs={'slug': request.user.username}))
    return render(request, 'base.html', {})