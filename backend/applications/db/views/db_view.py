from rest_framework import viewsets

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