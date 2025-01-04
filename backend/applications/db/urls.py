from django.urls import path

from applications.db.views.table_view import TableDataTypeViewSet
from applications.db.views.query_view import QueryView
from applications.db.views.db_view import ConnectionViewSet


urlpatterns = [
    path('connection/', ConnectionViewSet.as_view({ 
        "get": "list",
        "post": "create",
        "put": "update",
    }), name='connection-add'),
]

urlpatterns += [
    path('query/', QueryView.as_view(), name='query'),
]

urlpatterns += [
    path('table/', TableDataTypeViewSet.as_view({'get': 'list'}), name='table'),
]