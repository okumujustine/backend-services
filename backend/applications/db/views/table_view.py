from applications.db.models import TableDataType
from applications.db.serializers.table_serializer import TableDataTypeSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


# Create your views here.
class TableDataTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = TableDataType.objects.all()
    serializer_class = TableDataTypeSerializer
