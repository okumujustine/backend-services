import time
from django.db import connection
from applications.db.dynamic_schema import get_cached_schema
from applications.db.serializers.query_serializer import QuerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache

from applications.db.models import UserDBSchema


from graphene_django.views import GraphQLView

class DynamicGraphQLView(GraphQLView):
    # TODO: improve it to only build schema when structure changes
    def __init__(self, *args, **kwargs):
        # TODO: ( find a better solution ) - overriding library method to add custom logic
        # TODO: user current user schema
        self.schema = get_cached_schema(schema_user_give_name='okumu_gmail_com_default_cdc63bf4')
        super().__init__(*args, **kwargs)


    
class QueryView(APIView):
    def post(self, request, schema_name):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
      
        retrived_schema = UserDBSchema.objects.filter(
            user_give_name=schema_name,
            owner=request.user
        ).first()

        if not retrived_schema:
            return Response({"error": f"Schema {schema_name} not found"}, status=status.HTTP_404_NOT_FOUND)
    
        query = serializer.validated_data['query']

        try:
            with connection.cursor() as cursor:
                start_time = time.perf_counter()
                cursor.execute(f'SET search_path TO {retrived_schema.schema_name};')
                cursor.execute(query)
                end_time = time.perf_counter()
                
                execution_time = end_time - start_time
                cursor_execution_message = cursor.statusmessage

                if cursor_execution_message and (
                    'ALTER' in cursor_execution_message or 
                    'CREATE' in cursor_execution_message
                ):
                    cache.delete('graphql_schema')
                    get_cached_schema(schema_user_give_name=retrived_schema.schema_name)

            if cursor.description:
                rows = cursor.fetchall()
                columns = [desc[0] for desc in cursor.description]
                result_rows = [dict(zip(columns, row)) for row in rows]
                result = {"columns": columns, "rows": result_rows}
                return Response(
                    { 'result': {
                        "data": result, 
                        "execution_time": execution_time
                        } 
                    }, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response({ 
                    'result': {
                        "rows_affected": cursor.rowcount, 
                        "execution_time": execution_time, 
                        "status_message": cursor_execution_message
                    } 
                    }, 
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)