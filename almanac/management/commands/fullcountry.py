import re

from django.core.management.base import BaseCommand
import  requests
from bs4 import BeautifulSoup

from accounts.models import Country


class Command(BaseCommand):
    def handle(self, *args, **options):
        url = "https://www.officeholidays.com/countries"
        countrytext =  requests.request(url=url, method="GET").text
        soup = BeautifulSoup(countrytext, 'html5lib')
        res = []
        starttext = chr(160) + chr(160)
        for i in soup.find_all("a",  attrs={'href':re.compile('https://www.officeholidays.com/countries/')}):
            if i.text[:2] == starttext:
                res.append(Country(countryname=i.text[2:]))
        if res:
            Country.objects.bulk_create(res)
            print('finish')
        else:
            print('Objects not search')