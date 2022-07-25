import re

from django.core.management.base import BaseCommand
import  requests
from bs4 import BeautifulSoup
from ics import Calendar
from tatsu.exceptions import FailedParse

from accounts.models import Country
from almanac.models import HolidayCountry


class Command(BaseCommand):
    def handle(self, *args, **options):
        url = "https://www.officeholidays.com/countries"
        urlhappy = "https://www.officeholidays.com/ics/ics_country.php?tbl_country="
        countrytext =  requests.request(url=url, method="GET").text
        soup = BeautifulSoup(countrytext, 'html5lib')
        res = []
        starttext = chr(160) + chr(160)
        for i in soup.find_all("a",  attrs={'href':re.compile('https://www.officeholidays.com/countries/')}):
            if i.text[:2] == starttext:
                res.append(Country(
                    countryname=i.text[2:]
                ))
        if res:
            Country.objects.bulk_create(res)
        else:
            print('Objects not search')
        for cntr in Country.objects.all():
            holidays = []
            file = requests.get(urlhappy+cntr.countryname)
            if "We're sorry, but the page you were looking for does not exist." in file.text:
                continue
            try:
                calendar = Calendar(file.text)
                for holiday in list(calendar.events):
                    holidays.append(HolidayCountry(
                                                country=cntr,
                                                name= holiday.name.split(':')[1],
                                                datebegin=holiday.begin.datetime,
                                                dateend=holiday.end.datetime,
                                                description=holiday.description[:-51]
                                                )
                                 )
                HolidayCountry.objects.bulk_create(holidays)
            except FailedParse:
                continue
        print('finish')