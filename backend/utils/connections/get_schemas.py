

def list_schemas_tables_columns(conn):
    """
    Takes an existing psycopg2 connection instance and retrieves
    all schemas (except system schemas), their tables, and table 
    columns with data types.
    """
    cur = conn.cursor()
    try:
        # Create a cursor from the existing connection
        # Query the information_schema.columns view
        # to get schema, table, column, and data type
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

        # Print or process the results
        for row in rows:
            schema_name, table_name, column_name, data_type = row
            print(f"Schema: {schema_name} | Table: {table_name} | "
                  f"Column: {column_name} | Data Type: {data_type}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Optionally close the cursor if you're done with it
    
        cur.close()
