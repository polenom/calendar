from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from almanac.models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from accounts.models import CustomUser


class HolidayCountyrDateSerializer(serializers.ModelSerializer):
    datebegin = serializers.DateTimeField(format="%m/%d/%H:%M")
    dateend = serializers.DateTimeField(format="%m/%d/%H:%M")

    class Meta:
        model = HolidayCountry
        fields= ['name', 'description', 'datebegin', 'dateend']


class HolidayCountrySerializer(serializers.ModelSerializer):
    holidaycountry = HolidayCountyrDateSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = ['countryname', 'holidaycountry']


class NotesSerializer(serializers.ModelSerializer):


    class Meta:
        model = MarketDay
        fields = ['title', 'startdate', 'finishdate', 'description']

class NoteAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketDay
        fields = ['user', 'title', 'startdate', 'finishdate', 'description']



class UserForNotesSerializer(serializers.ModelSerializer):
    markday = NotesSerializer(many=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'markday']


class AdvanceUserSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    city = serializers.StringRelatedField()

    class Meta:
        model = CustomUser
        fields = [ 'country']


class CityUserSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return f'{value}'


class MarkUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketDay
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    advance = AdvanceUserSerializer(read_only=True)
    markday = MarkUserSerializer(many=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'advance', 'markday']


class MyToken(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyToken, cls).get_token(user)
        token['username'] = user.username
        print(user.username , user.country)
        token['country'] = user.country.countryname if user.country else ''
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_login:
            self.user.is_login = True
            self.user.save()
        return data
    

class MyTokenRefresh(TokenRefreshSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(MyToken, cls).get_token(user)
        token['username'] = user.username
        token['country'] = user.country.countryname if user.country else ''
        return token


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password')
        # extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
            instance.save()
        return instance

class UsernameSerializer(serializers.Serializer):

    username = serializers.CharField()