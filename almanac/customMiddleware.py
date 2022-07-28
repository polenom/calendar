import zoneinfo
from datetime import datetime, timedelta

from django.contrib.sessions.backends.db import SessionStore

from accounts.models import CustomUser
from almanacAPI.serializer import MyToken


class CustomMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.method == "GET" and  '/api/auth/complete/google-oauth2/' in request.path:
            try:
                key = response.cookies.get('sessionid').value
            except AttributeError:
                return response
            if SessionStore(session_key=key).get('_auth_user_id' ):
                user = CustomUser.objects.get(pk= SessionStore(session_key=key).get('_auth_user_id' ))
                token = MyToken.get_token(user)
                zone = zoneinfo.ZoneInfo('Europe/Minsk')
                time = datetime.now(zone) + timedelta(seconds=600)
                response.set_cookie('username',
                                    value=user.username,
                                    expires =  time,
                                    )
                response.set_cookie('refresh',
                                    value=token.__str__(),
                                    expires = time,
                                    )
                response.set_cookie('access',
                                    value=token.access_token.__str__(),
                                    expires=time,
                                    )
        return  response


