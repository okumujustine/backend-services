from db.serializers.query import QuerySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class QueryView(APIView):
    def post(self, request):
        serializer = QuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        query = serializer.validated_data['query']
        print(query)
        return Response({'data': query}, status=status.HTTP_200_OK)