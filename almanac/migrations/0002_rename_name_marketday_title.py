# Generated by Django 4.0.5 on 2022-07-28 06:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('almanac', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='marketday',
            old_name='name',
            new_name='title',
        ),
    ]