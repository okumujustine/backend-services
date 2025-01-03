from django.urls import path

from db.views.table import TableDataTypeViewSet
from db.views.query import QueryView

urlpatterns = [
    path('query/', QueryView.as_view(), name='query'),
]

urlpatterns += [
    path('table/', TableDataTypeViewSet.as_view({'get': 'list'}), name='table'),
]