# Generated by Django 4.0.5 on 2022-07-28 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_customuser_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='text',
            field=models.CharField(default='', max_length=300, null=True),
        ),
    ]
