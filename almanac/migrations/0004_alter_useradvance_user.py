# Generated by Django 4.0.5 on 2022-06-19 14:19

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('almanac', '0003_alter_useradvance_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useradvance',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='advance', serialize=False, to=settings.AUTH_USER_MODEL),
        ),
    ]
