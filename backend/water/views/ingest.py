from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from water.models import Sensor
from water.serializers import SensorReadingSerializer


class SensorIngestView(APIView):
    """
    IoT ingestion endpoint.
    AI logic must not live here; only validation and persistence.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        device_id = request.data.get("sensor")
        try:
            Sensor.objects.get(device_id=device_id)
        except Sensor.DoesNotExist:
            return Response({"detail": "Unknown sensor device_id"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SensorReadingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

