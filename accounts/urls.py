from django.urls import path, include

from accounts.views import RegForm, AuthForm, logou

urlpatterns = [
    path('/reg/', RegForm.as_view(), name='reg'),
    path('/auth/', AuthForm.as_view(), name='auth'),
    path('/logout/', logou, name='logou'),
]
