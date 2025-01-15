

from django.conf import settings
from typing import Union

from openai import OpenAI


def generate_sql_query(user_request: str, schema_info: Union[ None, str] = None) -> Union[str, None]:
    """
    Sends a prompt to OpenAI to generate a valid SQL (PostgreSQL) statement 
    based on user_request. This can include CREATE, SELECT, UPDATE, or DELETE.
    Optionally includes schema_info if you have details about your tables, columns, etc.
    """

    system_prompt = f"""
    You are an expert in SQL (PostgreSQL). 
    I have a database with the following schema:
    {schema_info or "Schema information not provided."}

    Generate a valid SQL statement (PostgreSQL dialect) that accomplishes this.
    Return only the SQL statement format (no additional text).
    Please provide the SQL query without enclosing triple backticks or any other code fence formatting.
    """

    user_prompt = f"""
        \"{user_request}\"
    """

    client = OpenAI()
    
    openai_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "developer", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    sql_query = openai_response.choices[0].message.content
        
    return sql_query