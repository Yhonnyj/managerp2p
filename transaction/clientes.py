from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Client
from .serializers import ClienteSerializer

# ✅ Vista sin paginación para obtener todos los clientes (usado en modales)
class ClienteFullListView(APIView):
    def get(self, request):
        clientes = Client.objects.all()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

