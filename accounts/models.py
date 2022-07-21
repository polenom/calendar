from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class Country(models.Model):
    countryname = models.CharField(max_length=400)

    def __str__(self):
        return self.countryname


class CustomUser(AbstractUser):
    text = models.CharField(max_length=300)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, related_name="custom")
    is_login = models.BooleanField(default=False)
