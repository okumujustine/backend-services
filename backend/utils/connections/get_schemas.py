

from utils.connections.postgres_conn import PostgresConnection


def list_schemas_tables_columns(connection_object: dict[str, str]):
    """
    Takes an existing psycopg2 connection instance and retrieves
    all schemas (except system schemas), their tables, and table 
    columns with data types, and then restructures the data into a 
    nested dictionary for the frontend.

    Returns a dictionary in the format:
    {
        "schema1": {
            "table1": [
                {"column_name": "col1", "data_type": "datatype1"},
                {"column_name": "col2", "data_type": "datatype2"},
                ...
            ],
            "table2": [ ... ]
        },
        "schema2": { ... }
    }
    """
    conn = PostgresConnection(**connection_object).connect()
    cur = conn.cursor()
    result = {}
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
        rows = cur.fetchall()

        # Process each row to build the nested dictionary
        for row in rows:
            schema_name, table_name, column_name, data_type = row

            # Create the schema entry if it doesn't exist
            if schema_name not in result:
                result[schema_name] = {}

            # Create the table entry if it doesn't exist
            if table_name not in result[schema_name]:
                result[schema_name][table_name] = []

            # Append the column information to the table's list of columns
            result[schema_name][table_name].append({
                "column_name": column_name,
                "data_type": data_type
            })

        return result

    except Exception as e:
        print(f"Error: {e}")
        return None

    finally:
        cur.close()

