from django.urls import path
from applications.db.views.table_view import TableDataTypeViewSet
from applications.db.views.query_view import QueryView
from applications.db.views.db_view import ConnectionViewSet, get_database_schemas


urlpatterns = [
    path('connection/', ConnectionViewSet.as_view({ 
        "get": "list",
        "post": "create",
        "put": "update",
    }), name='connection-add'),
    path('schema/', get_database_schemas, name="get_database_schemas")
]

urlpatterns += [
    path('query/<str:id_name>', QueryView.as_view(), name='query'),
]

urlpatterns += [
    path('table/', TableDataTypeViewSet.as_view({'get': 'list'}), name='table'),
]