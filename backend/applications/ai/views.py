from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

from applications.db.models import DbConnectionModel
from utils.ai.llm.openai.openai_main import generate_sql_query
from utils.connections.get_schemas import list_schemas_tables_columns

# Create your views here.

@api_view(["POST"])
def ai_query_db(request, db_id_name):
    if request.method == "POST":

        query = request.data.get("query", "")
        if not query:
            return Response({ "result": {"error": "Query must be provided"} }, status=status.HTTP_400_BAD_REQUEST)
    
        # get connection
        conn = get_object_or_404(DbConnectionModel, user=request.user, id_name=db_id_name)

        # get db schema
        db_schemas = list_schemas_tables_columns(connection_object=conn.to_connection_dict())
        
        # prompt ai with stringified db schemas
        generated_query = generate_sql_query(schema_info=str(db_schemas), user_request=query)

        return Response({"result": { "data": generated_query }}, status=status.HTTP_200_OK)