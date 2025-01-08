from typing import Any
import psycopg2
import psycopg2.pool

class PostgresConnection:
    def __init__(
            self, 
            database: str,
            user: str,
            password: str,
            host: str,
            port: str
        ) -> None:
        self.database = database
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.connection_pool = None
    
    def connect(self) -> Any:
        if self.connection_pool:
            print("returning existing connection")
            return self.connection_pool
        
        self.connection_pool = psycopg2.pool.SimpleConnectionPool(
            minconn=1,
            maxconn=1,
            database=self.database,
            user=self.user,
            password=self.password,
            host=self.host,
            port=self.port
        )
        try:
            conn = self.connection_pool.getconn()
            if conn:
                print("Connection successful")
                return conn
        except Exception as e:
            print(f"Error: {e}")
            return None

    def __str__(self) -> str:
        return f"PostgresConnection({self.database}, {self.user}, {self.host}, {self.port}, {self.password})"