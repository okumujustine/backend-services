

from utils.connections.postgres_conn import PostgresConnection


def list_schemas_tables_columns(connection_object: dict[str, str]):
    """
    Takes an existing psycopg2 connection instance and retrieves
    all schemas (except system schemas), their tables, and table 
    columns with data types, and then restructures the data into a 
    nested dictionary for the frontend.
    """
    conn = PostgresConnection(**connection_object).connect()
    cur = conn.cursor()
    result = {}
    try:
        result = {}

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
        rows = cur.fetchall()

        for row in rows:
            schema_name, table_name, column_name, data_type = row

            if schema_name not in result:
                result[schema_name] = {}

            if table_name not in result[schema_name]:
                result[schema_name][table_name] = []

            result[schema_name][table_name].append({
                "column_name": column_name,
                "data_type": data_type
            })

        schemas = []
        schema_counter = 1
        for schema_name in sorted(result.keys()):
            schema_obj = {
                "id": schema_counter,
                "title": schema_name,
                "tables": []
            }
            table_counter = 1
            for table_name in sorted(result[schema_name].keys()):
                table_obj = {
                    "id": table_counter,
                    "title": table_name,
                    "columns": []
                }
                table_counter += 1

                for column in result[schema_name][table_name]:
                    table_obj["columns"].append({
                        "name": column["column_name"],
                        "type": column["data_type"],
                        "nullable": True,
                        "isPrimary": False
                    })

                schema_obj["tables"].append(table_obj)
            schemas.append(schema_obj)
            schema_counter += 1

        return schemas


    except Exception as e:
        print(f"Error: {e}")
        return None

    finally:
        cur.close()

