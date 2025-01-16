import psycopg2
import time
from typing import Any

from utils.connections.postgres_conn import PostgresConnection


def db_activity(connection_object: dict[str, str], query: str) -> Any:
    pg_conn = PostgresConnection(**connection_object).connect()
    pg_conn.autocommit = True
    cursor = pg_conn.cursor()
    try:
        start_time = time.perf_counter()
        cursor.execute(query)
        end_time = time.perf_counter()

        execution_time = end_time - start_time

        if cursor.description:
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            result_rows = [dict(zip(columns, row)) for row in rows]
            result = {"columns": columns, "rows": result_rows}
            return {"data": result, "execution_time": execution_time}
        else:
            rowcount = cursor.rowcount
            return {"rows_affected": rowcount, "execution_time": execution_time}
    except psycopg2.Error as e:
        return {'error': str(e), "status":400}
    
    except Exception as e:
        return {'error': str(e), "status":500}
    finally:
        cursor.close()

def graphql_db_activity(connection_object: dict[str, str], query: str) -> Any:
    pg_conn = PostgresConnection(**connection_object).connect()
    pg_conn.autocommit = True
    cursor = pg_conn.cursor()

    cursor.execute(query)
    columns = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()

    return {"rows": rows, "columns": columns}