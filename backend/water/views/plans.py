import logging
import os

from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from water.models import ClimateSnapshot, UserProfile, WaterPlan, WaterStorage, WaterSystem
from water.serializers import WaterPlanSerializer
from water.services.ai_planner import AIPlannerService
from water.services.demand_engine import DemandEngine

logger = logging.getLogger(__name__)


class GenerateWaterPlanView(APIView):
    """
    Calls AI planner with pre-computed context only.
    No raw sensor ingestion or guesswork allowed.
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")
        horizon_days = int(request.data.get("horizon_days", settings.PLANNER_DEFAULT_HORIZON_DAYS))
        profile = UserProfile.objects.filter(user_id=user_id).select_related("location").first()
        if not profile:
            return Response({"detail": "user_id missing or not found"}, status=400)

        systems = list(WaterSystem.objects.filter(owner=profile))
        storages = list(WaterStorage.objects.filter(system__owner=profile))
        demand_units = list(profile.demand_units.all())
        climate = None
        if profile.location:
            climate = ClimateSnapshot.objects.filter(location=profile.location).first()

        demand = DemandEngine().daily_demand(demand_units)
        priority_rules = {
            "order": ["human", "livestock", "crop"],
            "notes": "Preserve drinking water first; ration irrigation based on rainfall outlook.",
        }

        if not os.getenv("OPENAI_API_KEY"):
            return Response({"detail": "OPENAI_API_KEY not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        planner = AIPlannerService()
        try:
            plan_text = planner.generate_plan(profile, systems, storages, demand_units, climate, horizon_days)
        except Exception as exc:  # noqa: BLE001
            logger.exception("AI planner failed")
            return Response({"detail": "Failed to generate plan", "error": str(exc)}, status=500)

        with transaction.atomic():
            WaterPlan.objects.filter(owner=profile, status=WaterPlan.Status.ACTIVE).update(
                status=WaterPlan.Status.ARCHIVED
            )
            plan = planner.store_plan(profile, systems[0] if systems else None, plan_text, priority_rules, horizon_days)

        return Response(WaterPlanSerializer(plan).data, status=status.HTTP_201_CREATED)


class ActivePlanView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get("user_id")
        profile = UserProfile.objects.filter(user_id=user_id).first()
        if not profile:
            return Response({"detail": "user_id missing or not found"}, status=400)

        plan = profile.water_plans.filter(status=WaterPlan.Status.ACTIVE).first()
        if not plan:
            return Response({"detail": "No active plan"}, status=404)

        return Response(WaterPlanSerializer(plan).data)

