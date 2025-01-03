

from django.urls import path

from db_table.views import TableDataTypeViewSet


urlpatterns = [
    path("list/", TableDataTypeViewSet.as_view({"get": "list"})),
]