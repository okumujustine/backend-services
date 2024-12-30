from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from db_table.models import TableDataType
from db_table.serializer import TableDataTypeSerializer

# Create your views here.
class TableDataTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = TableDataType.objects.all()
    serializer_class = TableDataTypeSerializer

