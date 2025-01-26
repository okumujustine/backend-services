from django.db import connection

def db_schema_for_graphql(schema_user_give_name: str):
    schema = {}
    try:
        with connection.cursor() as cur:
            cur.execute(f'SET search_path TO {schema_user_give_name};')
            query = f"""
                SELECT 
                    table_schema, 
                    table_name, 
                    column_name, 
                    data_type
                FROM information_schema.columns
                WHERE table_schema IN ('{schema_user_give_name}')
                ORDER BY table_schema, table_name, ordinal_position;
            """
            cur.execute(query)
            records = cur.fetchall()

            for record in records:
                schema_name, table_name, column_name, data_type = record
                if schema_name not in schema:
                    schema[schema_name] = {}

                if table_name not in schema[schema_name]:
                    schema[schema_name][table_name] = []

                schema[schema_name][table_name].append({
                    "column_name": column_name,
                    "data_type": data_type
                })

            return schema
                    
    except Exception as e:
        print(f"Error: {e}")
        return None