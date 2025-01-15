from rest_framework.serializers import Serializer, CharField

class GenerateSQLSerializer(Serializer):
    query = CharField(required=True)