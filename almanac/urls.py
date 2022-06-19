from django.contrib import admin
from django.urls import path, include

from almanac.views import one, StartPage

urlpatterns = [
    path('user/<slug:slug>', StartPage.as_view(), name='start'),
    path('', one)
]
