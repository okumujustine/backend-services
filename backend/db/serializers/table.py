from rest_framework import serializers

from db.models import TableDataType

class TableDataTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableDataType
        fields = ('name', 'description')