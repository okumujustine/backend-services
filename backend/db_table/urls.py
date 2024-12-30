

from django.urls import path

from db_table.views import TableDataTypeViewSet


urlpatterns = [
    path("db_table/", TableDataTypeViewSet.as_view({"get": "list"})),
]