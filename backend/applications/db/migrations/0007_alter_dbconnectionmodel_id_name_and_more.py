# Generated by Django 5.1.4 on 2025-01-26 04:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0006_alter_dbconnectionmodel_id_name_userdbschema'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dbconnectionmodel',
            name='id_name',
            field=models.CharField(default='d40dd88a', max_length=100),
        ),
        migrations.AlterField(
            model_name='userdbschema',
            name='schema_name',
            field=models.CharField(max_length=100, null=True, unique=True),
        ),
    ]
