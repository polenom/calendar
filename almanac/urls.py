from django.contrib import admin
from django.urls import path, include

from almanac.views import one, StartPage, AuthJS

urlpatterns = [
    path('user/<slug:slug>/', StartPage.as_view(), name='start'),
    path('', one),
    path('auth/js/', AuthJS.as_view())
]
