from main.celery import app
from almanac.models import *
from  datetime import datetime, timedelta, timezone

from .service import send

@app.task
def send_notes_left():
    print(MarketDay.objects.filter(startdate__range=(datetime.now(timezone.utc)+timedelta(minutes=180),datetime.now(timezone.utc)+timedelta(minutes=190))),111111111111111)
    for i in MarketDay.objects.filter(startdate__range=(datetime.now(timezone.utc)+timedelta(minutes=180),datetime.now(timezone.utc)+timedelta(minutes=190))):
        email = i.user.email
        print(i.title, email)
        if email:
            send(email, f'{i.user.username}, 15 minut left ',  i.title)


