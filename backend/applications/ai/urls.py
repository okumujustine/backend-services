from django.urls import path

from applications.ai.views import ai_query_db


urlpatterns = [
    path("query/<str:db_id_name>", ai_query_db, name="ai-query")
]