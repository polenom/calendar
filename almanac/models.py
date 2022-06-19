from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class City(models.Model):
    cityname = models.CharField(max_length=400)

class Country(models.Model):
    countryname = models.CharField(max_length=400)


class UserAdvance(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE ,related_name='advance', primary_key=True)
    city = models.ForeignKey(City,on_delete=models.SET_NULL, related_name='useradvance', null=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, related_name='useradvance', null=True)
    ipaddr = models.CharField(max_length=15)


class MarketDay(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='markday')
    startdate = models.DateTimeField()
    finishdate = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=400)


class HolidayCity(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='holiday')
    date = models.DateTimeField()
    description = models.CharField(max_length=400)


class HolidayCountry(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='holidaycountry')
    date = models.DateTimeField()
    description = models.CharField(max_length=400)
