from django.db import models


class Connection(models.Model):
    name = models.CharField(max_length=50, unique=True)
    host = models.CharField(max_length=100)
    port = models.IntegerField()
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'connection'
        verbose_name = 'Connection'
        verbose_name_plural = 'Connections'


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
