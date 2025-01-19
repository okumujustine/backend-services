from django.urls import path
from graphene_django.views import GraphQLView

from applications.db.dynamic_schema import get_cached_schema
from applications.db.views.table_view import TableDataTypeViewSet
from applications.db.views.query_view import QueryView
from applications.db.views.db_view import ConnectionViewSet, get_database_schemas
from django.views.decorators.csrf import csrf_exempt


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

# graphQLs
# TODO: remove csrf_exempt and replace with real authentication
  
urlpatterns += [
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True, schema=get_cached_schema()))),
]