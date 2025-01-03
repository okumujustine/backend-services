from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema

from .serializer import QuerySerializer

# Create your views here.
@method_decorator(
    name='post',
    decorator=swagger_auto_schema(
        request_body=QuerySerializer,
        responses={200: QuerySerializer}
    )
)
class QueryView(APIView):
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        query = serializer.validated_data['query']
        print(query)
        return Response({'data': query}, status=status.HTTP_200_OK)