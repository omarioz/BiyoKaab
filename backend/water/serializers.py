from rest_framework import serializers

from .models import (
    ClimateSnapshot,
    Location,
    Sensor,
    SensorReading,
    UserProfile,
    WaterDemandUnit,
    WaterPlan,
    WaterStorage,
    WaterSystem,
)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "user_type", "location", "fog_system_type"]


class WaterStorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterStorage
        fields = ["id", "name", "capacity_liters", "current_volume_liters"]


class WaterSystemSerializer(serializers.ModelSerializer):
    storages = WaterStorageSerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)

    class Meta:
        model = WaterSystem
        fields = ["id", "name", "system_type", "location", "storages"]


class SensorSerializer(serializers.ModelSerializer):
    system = WaterSystemSerializer(read_only=True)

    class Meta:
        model = Sensor
        fields = ["id", "device_id", "description", "system"]


class SensorReadingSerializer(serializers.ModelSerializer):
    sensor = serializers.SlugRelatedField(slug_field="device_id", queryset=Sensor.objects.all())

    class Meta:
        model = SensorReading
        fields = [
            "id",
            "sensor",
            "recorded_at",
            "distance_cm",
            "water_level",
            "humidity",
            "temperature",
            "soil_moisture",
            "motion_detected",
        ]
        read_only_fields = ["recorded_at"]


class WaterDemandUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterDemandUnit
        fields = ["id", "category", "name", "count", "area_hectares", "daily_need_liters"]


class ClimateSnapshotSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)

    class Meta:
        model = ClimateSnapshot
        fields = ["id", "location", "season", "days_until_rainfall", "recorded_at", "source"]


class WaterPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterPlan
        fields = [
            "id",
            "owner",
            "system",
            "plan_text",
            "date_start",
            "date_end",
            "priority_rules",
            "status",
            "created_at",
        ]
        read_only_fields = ["status", "created_at"]


