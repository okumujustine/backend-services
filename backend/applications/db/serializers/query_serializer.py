from rest_framework import serializers

class QuerySerializer(serializers.Serializer):
    query = serializers.CharField(required=True)