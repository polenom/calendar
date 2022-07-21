from django.contrib.auth.models import User, AbstractUser
from django.db import models


# Create your models here.
from django.contrib.auth import get_user_model

from accounts.models import Country

User = get_user_model()

class City(models.Model):
    cityname = models.CharField(max_length=400)

    def __str__(self):
        return self.cityname





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
