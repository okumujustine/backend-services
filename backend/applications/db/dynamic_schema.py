from django.db import connection
from django.core.cache import cache
import graphene

from utils.connections.get_graphql_db_schema import db_schema_for_graphql

# TEST all the types differently
POSTGRES_TYPE_MAPPING_TO_GRAPHENE_TYPE_MAPPING = {
    "smallint": graphene.Int,
    "integer": graphene.Int,
    "bigint": graphene.Int,
    "decimal": graphene.Float,
    "numeric": graphene.Float,
    "character varying": graphene.String,
    "real": graphene.Float,
    "date": graphene.Date,
    "text": graphene.String,
    "bool": graphene.Boolean,
    "uuid": graphene.String,
}

def map_postgres_type_to_graphene(data_type: str):
    return POSTGRES_TYPE_MAPPING_TO_GRAPHENE_TYPE_MAPPING.get(data_type.lower(), graphene.String)

def generate_graphene_types_from_schema(db_schemas):
    dynamic_types = {}
    for schema in db_schemas.values():  
        for table_name, columns in schema.items():
            fields = {}
            for col in columns:
                column_name = col["column_name"]
                data_type = col["data_type"]

                graphene_type = map_postgres_type_to_graphene(data_type)
                fields[column_name] = graphene_type()

            type_name = ''.join(word.capitalize() for word in table_name.split('_')) + 'Type'
            dynamic_type = type(type_name, (graphene.ObjectType,), fields)
            dynamic_types[table_name] = dynamic_type

    return dynamic_types


def make_resolver(schema_name, table_name, gql_type):
    def resolver(root, info):
        with connection.cursor() as cursor:
            cursor.execute(f'SET search_path TO {schema_name};')
            query = f'SELECT * FROM "{schema_name}"."{table_name}"'
            cursor.execute(query)

            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()

            graphql_db_result = {"rows": rows, "columns": columns}
            results = [gql_type(**dict(zip(graphql_db_result["columns"], row))) for row in graphql_db_result["rows"]]
            return results
    return resolver

def generate_query(dynamic_types, schema_name):

    class_attributes = {}
    for table_name, gql_type in dynamic_types.items():
        field_name = f"all_{table_name}"
        class_attributes[field_name] = graphene.List(gql_type)

        resolver = make_resolver(schema_name, table_name, gql_type)
        class_attributes[f"resolve_{field_name}"] = resolver

    Query = type("Query", (graphene.ObjectType,), class_attributes)
    return Query


def get_cached_schema(schema_user_give_name: str):
    cached_db_schema = cache.get('graphql_schema')

    if not cached_db_schema:
        graphql_schema = db_schema_for_graphql(schema_user_give_name)
        cached_db_schema = graphql_schema
        cache.set('graphql_schema', cached_db_schema)

    dynamic_types = generate_graphene_types_from_schema(cached_db_schema)
    DynamicQuery = generate_query(dynamic_types, schema_name=schema_user_give_name)
    new_schema = graphene.Schema(query=DynamicQuery)
    return new_schema