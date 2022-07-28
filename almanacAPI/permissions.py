import json
import jwt

from rest_framework import permissions
import base64
from rest_framework_simplejwt.authentication import JWTAuthentication

from accounts.models import CustomUser


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return bool(request.user and request.user.is_staff)


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, views):
        return bool(request.user.is_staff or request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        return obj.pk == request.user.pk


class IsLoginOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        token = body.get('refresh', None)
        if token:
            decoded = jwt.decode(token, options={'verify_signature': False})
            try:
                user =CustomUser.objects.get(username=decoded['username'])
                return user.is_login
            except CustomUser.DoesNotExist:
                pass
        return False


