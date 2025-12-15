import logging
import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from water.models import ClimateSnapshot, SensorReading, UserProfile, WaterStorage
from water.services.ai_planner import AIPlannerService
from water.services.availability_engine import WaterAvailabilityEngine
from water.services.demand_engine import DemandEngine

logger = logging.getLogger(__name__)


class AIChatView(APIView):
    """
    Conversational AI endpoint for chat interface.
    Provides context-aware responses about water management.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        messages = request.data.get("messages", [])
        
        if not messages:
            return Response({"detail": "messages array is required"}, status=400)
        
        if not isinstance(messages, list):
            return Response({"detail": "messages must be an array"}, status=400)

        profile = UserProfile.objects.filter(user_id=user_id).select_related("location").first()
        if not profile:
            return Response({"detail": "user_id missing or not found"}, status=400)

        if not os.getenv("OPENAI_API_KEY"):
            return Response(
                {"detail": "OPENAI_API_KEY not configured"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Build context from user's current system state
        context = self._build_context(profile)

        planner = AIPlannerService()
        try:
            response_text = planner.chat(messages, context)
            return Response(
                {
                    "message": response_text,
                    "role": "assistant",
                },
                status=status.HTTP_200_OK
            )
        except Exception as exc:
            logger.exception("AI chat failed")
            return Response(
                {"detail": "Failed to generate response", "error": str(exc)},
                status=500
            )

    def _build_context(self, profile: UserProfile) -> dict:
        """Build context from user's water system data."""
        storages = list(WaterStorage.objects.filter(system__owner=profile))
        
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
        climate_info = "Not available"
        if profile.location:
            climate = ClimateSnapshot.objects.filter(location=profile.location).first()
            if climate:
                climate_info = f"{climate.season} season, {climate.days_until_rainfall} days until rainfall"

        total_capacity = sum(float(s.capacity_liters) for s in storages)

        return {
            "available_liters": availability["available_liters"],
            "daily_demand_liters": demand_result["total_daily_liters"],
            "storage_capacity": total_capacity,
            "climate_info": climate_info,
            "user_type": profile.user_type,
            "location": profile.location.region if profile.location else "Unknown",
        }

