from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from applications.db.models import DbConnectionModel
from applications.db.serializers.db_serializer import ConnectionSerializer


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
    """
    Gets all the db schema by provided db_name
    GET /query/?db_name=abc
    """
    # TODO: track user's specific table and only display their schemas
    if request.method == 'GET':
        db_name: str = request.query_params.get("db_name", None)
        if not db_name:
            return Response({ "result": {"error": "Database name must be provided as request parameter"} })

        # TODO: get all the schemas

        return Response({ "result": "cool"}, status=status.HTTP_200_OK)