from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from water.models import Sensor, SensorReading
from water.serializers import SensorReadingSerializer


class DeviceStatusView(APIView):
    """
    Get the latest sensor reading for a device and calculate water tank status.
    Converts distance_cm to water volume based on tank configuration.
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        device_id = request.query_params.get("device_id")
        if not device_id:
            return Response(
                {"detail": "device_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the sensor for this device_id
        try:
            sensor = Sensor.objects.get(device_id=device_id)
        except Sensor.DoesNotExist:
            return Response(
                {"detail": f"No sensor found for device {device_id}"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get the latest reading for this sensor
        try:
            latest_reading = sensor.readings.order_by('-recorded_at').first()
        except Exception as e:
            return Response(
                {"detail": f"Error fetching sensor reading: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not latest_reading:
            return Response(
                {"detail": f"No sensor readings found for device {device_id}"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Tank configuration - these should ideally come from a database model
        # TODO: Make this configurable per device via a DeviceConfig model or settings
        # For now, using reasonable defaults that can be configured
        TANK_HEIGHT_CM = 100.0  # Height of tank in cm (default: 100cm = 1m)
        TANK_CAPACITY_L = 200.0  # Total capacity in liters (default: 200L)
        
        # Note: To customize per device, you could:
        # 1. Create a DeviceConfig model with device_id, tank_height_cm, tank_capacity_l
        # 2. Or use environment variables with device-specific prefixes
        # 3. Or pass as query parameters (less secure but flexible)
        
        # Calculate water level from distance
        # distance_cm is the distance from sensor (at top) to water surface
        # water_height = tank_height - distance
        if latest_reading.distance_cm is None:
            return Response(
                {"detail": f"No distance_cm data available for device {device_id}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        distance_cm = float(latest_reading.distance_cm)
        water_height_cm = max(0, TANK_HEIGHT_CM - distance_cm)
        
        # Calculate percentage full
        percent_full = (water_height_cm / TANK_HEIGHT_CM) * 100
        percent_full = max(0, min(100, percent_full))  # Clamp between 0-100
        
        # Calculate volume in liters (assuming cylindrical tank)
        # Volume = (water_height / tank_height) * capacity
        water_volume_l = (percent_full / 100) * TANK_CAPACITY_L

        return Response({
            "device_id": device_id,
            "last_update": latest_reading.recorded_at.isoformat(),
            "water_volume_l": round(water_volume_l, 1),
            "tank_capacity_l": TANK_CAPACITY_L,
            "percent_full": round(percent_full, 1),
            "distance_cm": round(distance_cm, 1),
            "water_height_cm": round(water_height_cm, 1),
            "humidity": float(latest_reading.humidity) if latest_reading.humidity else None,
            "temperature_c": float(latest_reading.temperature) if latest_reading.temperature else None,
        })


class LatestReadingView(APIView):
    """
    Get the latest sensor reading for a device (raw data).
    """
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        device_id = request.query_params.get("device_id")
        if not device_id:
            return Response(
                {"detail": "device_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            sensor = Sensor.objects.get(device_id=device_id)
            latest_reading = sensor.readings.order_by('-recorded_at').first()
        except Sensor.DoesNotExist:
            return Response(
                {"detail": f"No sensor found for device {device_id}"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": f"Error fetching sensor reading: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not latest_reading:
            return Response(
                {"detail": f"No sensor readings found for device {device_id}"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = SensorReadingSerializer(latest_reading)
        return Response(serializer.data)

