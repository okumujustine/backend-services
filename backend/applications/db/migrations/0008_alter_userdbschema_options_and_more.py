# Generated by Django 5.1.4 on 2025-01-26 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0007_alter_dbconnectionmodel_id_name_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='userdbschema',
            options={'verbose_name': 'User DB Schema', 'verbose_name_plural': 'User DB Schemas'},
        ),
        migrations.AlterField(
            model_name='dbconnectionmodel',
            name='id_name',
            field=models.CharField(default='fe5543a9', max_length=100),
        ),
        migrations.AlterModelTable(
            name='userdbschema',
            table='user_db_schema',
        ),
    ]
