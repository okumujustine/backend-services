import uuid
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db import connection


UserModel = get_user_model()

class DbConnectionModel(models.Model):
    name = models.CharField(max_length=50)
    id_name = models.CharField(max_length=100, default=uuid.uuid4().hex[:8])
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
        constraints = [
            models.UniqueConstraint(fields=['user', 'id_name'], name="unique_id_name_per_user")
        ]

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


class UserDBSchema(models.Model):
    schema_name = models.CharField(max_length=100, unique=True, null=True)
    user_give_name = models.CharField(max_length=100)
    owner = models.ForeignKey(UserModel, on_delete=models.CASCADE)

    class Meta:
        db_table = 'user_db_schema'
        verbose_name = 'User DB Schema'
        verbose_name_plural = 'User DB Schemas'



# Signal to create a user db schema after creating a user
@receiver(post_save, sender=UserModel)
def create_user_db_schema(sender, instance, created, **kwargs):
    if created:
        UserDBSchema.objects.create(
            owner=instance, 
            user_give_name="default",
        )

# Signal to create a postgres schema after creating a user db schema
@receiver(post_save, sender=UserDBSchema)
def create_postgres_schema(sender, instance, created, **kwargs):
    if created:
        identifier = uuid.uuid4().hex[:8]
        formatted_user_email = instance.owner.email.replace("@", "_").replace(".", "_")
        instance.schema_name = f"{formatted_user_email}_{instance.user_give_name}_{identifier}"
        instance.save()

        with connection.cursor() as cursor:
            cursor.execute(f"CREATE SCHEMA {instance.schema_name}")