from django.contrib import admin

from django.urls import path, include, re_path
from rest_framework import routers

from almanacAPI.views import UserViewSet, UserView, TokenAuth, MyObtainToken, CustomUserCreate, MyRefreshToken, \
    CheckUserCreate, CountryHolidays , UserNotes, UserNoteAdd, UserNoteUpdate, UserNoteDelete, GetUser
from rest_framework_simplejwt import views as jwt

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('',  include(router.urls)),
    path('user/', UserView.as_view()),
    path('authOther/', TokenAuth.as_view()),
    path('token/obtain/', MyObtainToken.as_view(), name='jwt-create'),
    path('token/refresh/', MyRefreshToken.as_view(), name='jwt-refresh'),
    path('user/create/', CustomUserCreate.as_view(), name='user-create'),
    path('user/check/', CheckUserCreate.as_view(), name='user-chek'),
    path('user/get/<str:name>/',GetUser.as_view()),
    path('country/holidays/<str:cntr>/', CountryHolidays.as_view(), name='country-holidays'),
    path('user/notes/', UserNotes.as_view(), name='user-notes'),
    path('user/note/add/<str:title>/', UserNoteAdd.as_view(), name='user-note-add'),
    path('user/note/update/<int:pk>/', UserNoteUpdate.as_view(), name="user-note-update"),
    path('user/note/delete/<int:pk>/', UserNoteDelete.as_view(), name="user-note-update"),
    re_path('^auth/', include('rest_framework_social_oauth2.urls')),
]