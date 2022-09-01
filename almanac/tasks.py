from main.celery import app
from almanac.models import *
from  datetime import datetime, timedelta, timezone

from .service import send

@app.task
def send_notes_left():
    now = datetime.now(timezone.utc)
    for i in MarketDay.objects.filter(startdate__range=(now + timedelta(minutes=195), now + timedelta(minutes=197))):
        email = i.user.email
        if email:
            send(email, f'{i.user.username}, 15 minut left ',  i.title)
    for i in MarketDay.objects.filter(startdate__range=(now + timedelta(hours=7), now + timedelta(hours=7, minutes=2))):
        email = i.user.email
        if email:
            send(email, f'{i.user.username}, 40 hours left ',  i.title)
    for i in MarketDay.objects.filter(startdate__range=(now + timedelta(days=1, hours=3), now + timedelta(days=1, hours=3, minutes=2))):

        email = i.user.email
        if email:
            send(email, f'{i.user.username}, 1 day left ',  i.title)

