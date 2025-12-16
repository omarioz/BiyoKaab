from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from water.models import Sensor
from water.serializers import SensorReadingSerializer


class SensorHistoryView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        device_id = request.query_params.get("device_id")
        if not device_id:
            return Response({"detail": "device_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sensor = Sensor.objects.get(device_id=device_id)
        except Sensor.DoesNotExist:
            return Response({"detail": "Sensor not found"}, status=status.HTTP_404_NOT_FOUND)

        readings = sensor.readings.all()[:200]
        data = SensorReadingSerializer(readings, many=True).data
        return Response({"device_id": device_id, "readings": data})





