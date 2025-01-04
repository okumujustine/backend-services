from typing import Any

from utils.connections.postgres_conn import PostgresConnection


def db_activity(connection_object: dict[str, str], query: str) -> Any:
    pg_conn = PostgresConnection(**connection_object).connect()
    print(pg_conn)