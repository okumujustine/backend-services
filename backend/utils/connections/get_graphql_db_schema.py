

from utils.connections.postgres_conn import PostgresConnection


def db_schema_for_graphql(connection_object: dict[str, str]):
    conn = PostgresConnection(**connection_object).connect()
    cur = conn.cursor()
    schema = {}
    try:
        query = """
            SELECT 
                table_schema, 
                table_name, 
                column_name, 
                data_type
            FROM information_schema.columns
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
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
    finally:
        cur.close()