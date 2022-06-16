from django.contrib import admin
from django.urls import path, include

from almanac.views import RegForm, AuthForm, test

urlpatterns = [
    path('reg/', RegForm.as_view()),
    path('auth/', AuthForm.as_view()),
    path('', test)
]
