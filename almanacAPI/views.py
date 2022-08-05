import time

from django.contrib.auth.models import User
from django.shortcuts import render, get_object_or_404

# Create your views here.
from rest_framework import viewsets, generics, mixins, permissions, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from almanac.models import HolidayCountry, MarketDay
from almanacAPI.serializer import UserSerializer, MyToken, CustomUserSerializer, MyTokenRefresh, UsernameSerializer, \
    HolidayCountrySerializer, HolidayCountyrDateSerializer, NotesSerializer, UserForNotesSerializer, NoteAddSerializer
from almanacAPI.permissions import IsOwnerOrAdmin, IsLoginOnly, IsHaveObj
from accounts.models import CustomUser, Country
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsOwnerOrAdmin,)


class CountryHolidays(generics.RetrieveAPIView):
    serializer_class = HolidayCountrySerializer
    permission_classes = (permissions.IsAuthenticated,)


    def get_object(self):
        country = get_object_or_404(Country, countryname = self.kwargs['cntr'])
        obj = HolidayCountry.objects.filter(country_id=country.pk)
        return country

class UserNoteAdd(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotesSerializer

    def perform_create(self, serializer):
        user = serializer.save(user=self.request.user)

class UserNoteUpdate(generics.UpdateAPIView):
    permission_classes = (IsHaveObj,)
    serializer_class = NotesSerializer
    queryset = MarketDay.objects.all()


class UserNoteDelete( generics.DestroyAPIView):
    permission_classes = (IsHaveObj,)
    serializer_class = NotesSerializer
    queryset = MarketDay.objects.all()

class UserView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    # authentication_classes = (SessionAuthentication,)
    # permission_classes = (permissions.AllowAny,)


    def get_object(self):
        obj = get_object_or_404(CustomUser, pk=1)
        return obj


class TokenAuth(APIView):
    def get(self, request, **kwargs):
        return Response('123')


class MyObtainToken(TokenObtainPairView):
    serializer_class = MyToken
    permission_classes = (permissions.AllowAny,)

@throttle_classes([])
class UserNotes(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserForNotesSerializer

    def get_object(self):
        obj = get_object_or_404(CustomUser, pk=self.request.user.pk)
        return obj

    # def get(self, request):
    #     user = CustomUser.objects.get(pk=request.user.pk)
    #     serializer = UserForNotesSerializer(user)
    #     return Response(serializer.data)





class MyRefreshToken(TokenRefreshView):
    permission_classes = (IsLoginOnly,)
    serializer_class = MyTokenRefresh




class CustomUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            if CustomUser.objects.filter(username=serializer.validated_data['username']):
                return Response({'message': 'user with the same name has already been created', 'error':'true'}, status=status.HTTP_400_BAD_REQUEST)
            user =serializer.save()
            token = MyToken.get_token(user)
            if user:
                json = {'username': user.username,
                        'refresh': token.__str__(),
                        'access': token.access_token.__str__()
                        }
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckUserCreate(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, format='json'):
        serializer = UsernameSerializer(data=request.data)
        if serializer.is_valid():
            try:
                CustomUser.objects.get(username = serializer.validated_data['username'])
                return Response({'status': True}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({'status': False}, status=status.HTTP_200_OK )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)