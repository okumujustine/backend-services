# Generated by Django 5.1.4 on 2025-01-11 16:58

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0003_rename_connection_dbconnectionmodel'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='dbconnectionmodel',
            name='name',
            field=models.CharField(max_length=50),
        ),
        migrations.AddConstraint(
            model_name='dbconnectionmodel',
            constraint=models.UniqueConstraint(fields=('user', 'name'), name='unique_name_per_user'),
        ),
    ]