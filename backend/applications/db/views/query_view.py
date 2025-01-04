from webbrowser import get
from applications.db.serializers.query_serializer import QuerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from applications.db.models import DbConnectionModel
from utils.connections.conn_util import db_activity


class QueryView(APIView):
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        query = serializer.validated_data['query']

        # get connection from the database
        conn = get_object_or_404(DbConnectionModel, user=request.user, name="postgres")

        db_action_result = db_activity(conn.to_connection_dict(), query)
        # print(db_action_result)
        return Response({'data': query}, status=status.HTTP_200_OK)