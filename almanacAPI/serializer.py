from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from almanac.models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from accounts.models import CustomUser


class AdvanceUserSerializer(serializers.ModelSerializer):
    country = serializers.StringRelatedField()
    city = serializers.StringRelatedField()

    class Meta:
        model = CustomUser
        fields = [ 'country']


class CityUserSerializer(serializers.RelatedField):
    def to_representation(self, value):
        print(value)
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
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_login:
            self.user.is_login = True
            self.user.save()
        return data
    

class MyTokenRefresh(TokenRefreshSerializer):
    pass


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