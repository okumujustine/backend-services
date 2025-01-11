from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from applications.custom_user.models import CustomUser

from .serializers import CustomUserSerializer

# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == "POST":
        serailizer = CustomUserSerializer(data=request.data)
        email = request.data["email"]
        user = CustomUser.objects.filter(email=email).first()
        if user:
            return Response({"result": {"error": f"{email} already exists"}}, status=status.HTTP_400_BAD_REQUEST)
        if serailizer.is_valid():
            user = serailizer.save()
            return Response({"result": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }}, status=status.HTTP_201_CREATED)
        else:
            return Response(serailizer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class RegisterView(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)