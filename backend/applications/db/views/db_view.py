from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from applications.db.models import DbConnectionModel
from applications.db.serializers.db_serializer import ConnectionSerializer
from utils.connections.get_schemas import list_schemas_tables_columns


class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = DbConnectionModel.objects.all()
    serializer_class = ConnectionSerializer

    def get_queryset(self):
        queryset = DbConnectionModel.objects.all()
        user = self.request.user
        return queryset.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
def get_database_schemas(request):
    if request.method == 'GET':
        id_name: str = request.query_params.get("id_name", None)
        if not id_name:
            return Response({ "result": {"error": "Database id_name must be provided as request parameter"} })

        conn = get_object_or_404(DbConnectionModel, user=request.user, id_name=id_name)

        db_schema_list = list_schemas_tables_columns(conn.to_connection_dict())

        return Response({ "result": db_schema_list}, status=status.HTTP_200_OK)