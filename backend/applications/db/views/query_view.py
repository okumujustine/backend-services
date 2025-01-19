from applications.db.dynamic_schema import get_cached_schema
from applications.db.serializers.query_serializer import QuerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.cache import cache

from applications.db.models import DbConnectionModel
from utils.connections.conn_util import db_activity


class QueryView(APIView):
    def post(self, request, id_name):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        query = serializer.validated_data['query']

        # get connection from the database
        conn = get_object_or_404(DbConnectionModel, user=request.user, id_name=id_name)
    
        db_action_result = db_activity(conn.to_connection_dict(), query)
    
        if 'error' in db_action_result:
            if db_action_result['status'] == 400:
                return Response(db_action_result, status=db_action_result['status'])
            return Response(db_action_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if (
            db_action_result and 
            'ALTER' in db_action_result["status_message"] or 
            'CREATE' in db_action_result["status_message"]
        ):
            # Build graphql api from db schema when  CREATEs or UPDATEs happens 
            # TODO: better way to build schema without blocking response
            print("builind now")
            cache.delete('graphql_schema')
            get_cached_schema()

        
        return Response({'result': db_action_result}, status=status.HTTP_200_OK)