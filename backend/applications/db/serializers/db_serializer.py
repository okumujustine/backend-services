from os import name, read
from rest_framework import serializers
from applications.db.models import DbConnectionModel


class ConnectionSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=False)
    class Meta:
        model = DbConnectionModel
        fields = ('name', 'description', 'host', 'port', 'username', 'password')
        read_only_fields = ('created_at', 'user')