from rest_framework.response import Response
from rest_framework.views import APIView

from water.models import ClimateSnapshot, SensorReading, UserProfile, WaterStorage
from water.serializers import WaterStorageSerializer
from water.services.availability_engine import WaterAvailabilityEngine
from water.services.constraint_engine import ConstraintEngine
from water.services.demand_engine import DemandEngine


class DashboardSummaryView(APIView):
    """
    Returns aggregated state for the dashboard.
    Pulls from services only; no AI here.
    """

    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        profile = UserProfile.objects.filter(user_id=user_id).select_related("location").first()
        if not profile:
            return Response({"detail": "user_id missing or not found"}, status=400)

        storages = (
            WaterStorage.objects.filter(system__owner=profile)
            .select_related("system")
            .prefetch_related("system__sensors")
        )

        latest_readings = {}
        readings_qs = (
            SensorReading.objects.filter(sensor__system__owner=profile)
            .select_related("sensor")
            .order_by("sensor_id", "-recorded_at")
        )
        for reading in readings_qs:
            if reading.sensor_id not in latest_readings:
                latest_readings[reading.sensor_id] = reading

        availability = WaterAvailabilityEngine().calculate(storages, latest_readings)
        demand_result = DemandEngine().daily_demand(profile.demand_units.all())

        climate = None
        if profile.location:
            climate = ClimateSnapshot.objects.filter(location=profile.location).first()

        constraints = ConstraintEngine().evaluate(
            available_liters=availability["available_liters"],
            daily_demand_liters=demand_result["total_daily_liters"],
            climate=climate,
        )

        return Response(
            {
                "storages": WaterStorageSerializer(storages, many=True).data,
                "availability": availability,
                "demand": demand_result,
                "constraints": constraints,
            }
        )

