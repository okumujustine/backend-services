from django.shortcuts import get_object_or_404
from graphene import List, Schema, String, Int, Float, Date, ObjectType

from applications.db.models import DbConnectionModel
from utils.connections.conn_util import graphql_db_activity
from utils.connections.get_schemas import list_schemas_tables_columns

def get_db_schema():
    
    return {
        "public": {
            "sales": [
                {"column_name": "sale_id", "data_type": "integer"},
                {"column_name": "sale_date", "data_type": "date"},
                {"column_name": "item_name", "data_type": "character varying"},
                {"column_name": "quantity", "data_type": "integer"},
                {"column_name": "price", "data_type": "numeric"}
            ],
            "sales2": [
                {"column_name": "sale_id", "data_type": "integer"},
                {"column_name": "sale_date", "data_type": "date"},
                {"column_name": "item_name", "data_type": "character varying"},
                {"column_name": "quantity", "data_type": "integer"},
                {"column_name": "price", "data_type": "numeric"}
            ],
        "users": [
            { "column_name": "id", "data_type": "serial" },
            { "column_name": "username", "data_type": "character varying(50)" },
            { "column_name": "email", "data_type": "character varying(100)" },
            { "column_name": "password", "data_type": "character varying(255)" },
            { "column_name": "created_at", "data_type": "date" },
            { "column_name": "updated_at", "data_type": "date" }
        ]
        }
    }

POSTGRES_TYPE_MAPPING_TO_GRAPHENE_TYPE_MAPPING = {
    "character varying": String,
    "integer": Int,
    "numeric": Float,
    "date": Date
}

def map_postgres_type_to_graphene(data_type: str):
    return POSTGRES_TYPE_MAPPING_TO_GRAPHENE_TYPE_MAPPING.get(data_type.lower(), String)

def generate_graphene_types_from_schema(db_schema):
    dynamic_types = {}
    public_schema = db_schema.get("public", {})

    for table_name, columns in public_schema.items():
        fields = {}
        for col in columns:
            column_name = col["column_name"]
            data_type = col["data_type"]

            graphene_type = map_postgres_type_to_graphene(data_type)
            fields[column_name] = graphene_type()

        type_name = ''.join(word.capitalize() for word in table_name.split('_')) + 'Type'
        dynamic_type = type(type_name, (ObjectType,), fields)
        dynamic_types[table_name] = dynamic_type

    return dynamic_types


def make_resolver(schema_name, table_name, gql_type):
    def resolver(root, info):
        # TODO: how to we get the current user
        # TODO: dynamic db name
        conn = get_object_or_404(DbConnectionModel, id_name="perfectly")
        print(list_schemas_tables_columns(connection_object=conn.to_connection_dict()))
        query = f'SELECT * FROM "{schema_name}"."{table_name}"'
        graphql_db_result = graphql_db_activity(
            connection_object=conn.to_connection_dict(),
            query=query
        )
        results = [gql_type(**dict(zip(graphql_db_result["columns"], row))) for row in graphql_db_result["rows"]]
        return results
    return resolver

def generate_query(dynamic_types, schema_name="public"):

    class_attributes = {}
    for table_name, gql_type in dynamic_types.items():
        field_name = f"all_{table_name}"
        class_attributes[field_name] = List(gql_type)

        resolver = make_resolver(schema_name, table_name, gql_type)
        class_attributes[f"resolve_{field_name}"] = resolver

    Query = type("Query", (ObjectType,), class_attributes)
    return Query


# @lru_cache(maxsize=1)
def get_cached_schema():
    db_schema = get_db_schema()
    dynamic_types = generate_graphene_types_from_schema(db_schema)
    DynamicQuery = generate_query(dynamic_types, schema_name="public")
    return Schema(query=DynamicQuery)

# Final schema to be used by your GraphQL view.
schema = get_cached_schema()