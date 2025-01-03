from django.urls import path

from .views import QueryView


urlpatterns = [
    path('execute/', QueryView.as_view(), name='query-execute'),
]