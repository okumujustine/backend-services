from applications.db.serializers.query_serializer import QuerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from applications.db.models import DbConnectionModel
from utils.connections.conn_util import db_activity


class QueryView(APIView):
    def post(self, request, db_name):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        query = serializer.validated_data['query']

        # get connection from the database
        conn = get_object_or_404(DbConnectionModel, user=request.user, name=db_name)

        db_action_result = db_activity(conn.to_connection_dict(), query)
        if 'error' in db_action_result:
            if db_action_result['status'] == 400:
                return Response(db_action_result, status=db_action_result['status'])
            return Response(db_action_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'result': db_action_result}, status=status.HTTP_200_OK)