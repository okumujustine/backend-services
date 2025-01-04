from django.db import models
from django.contrib.auth import get_user_model

UserModel = get_user_model()

class DbConnectionModel(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    host = models.CharField(max_length=100)
    port = models.IntegerField()
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'connection'
        verbose_name = 'Connection'
        verbose_name_plural = 'Connections'

    def to_connection_dict(self):
        return {
            'database': self.name,
            'host': self.host,
            'port': self.port,
            'user': self.username,
            'password': self.password
        }


class TableDataType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'table_data_type'
        verbose_name = 'Table Data Type'
        verbose_name_plural = 'Table Data Types'
