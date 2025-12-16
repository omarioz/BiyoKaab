from django.conf import settings
from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=120)
    region = models.CharField(max_length=120)
    latitude = models.DecimalField(max_digits=8, decimal_places=5, null=True, blank=True)
    longitude = models.DecimalField(max_digits=8, decimal_places=5, null=True, blank=True)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.region})"


class UserProfile(models.Model):
    class UserType(models.TextChoices):
        FARMER = "farmer", "Farmer"
        NOMAD = "nomad", "Nomad"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    user_type = models.CharField(max_length=12, choices=UserType.choices)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    fog_system_type = models.CharField(max_length=50, blank=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.user_type})"


class WaterSystem(models.Model):
    class SystemType(models.TextChoices):
        PORTABLE_FOG_NET = "portable_fog_net", "Portable Fog Net"
        FIXED_FOG_NET = "fixed_fog_net", "Fixed Fog Net"

    name = models.CharField(max_length=120)
    system_type = models.CharField(max_length=32, choices=SystemType.choices)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="water_systems")
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} - {self.system_type}"


class WaterStorage(models.Model):
    system = models.ForeignKey(WaterSystem, on_delete=models.CASCADE, related_name="storages")
    name = models.CharField(max_length=120, default="Tank")
    capacity_liters = models.DecimalField(max_digits=10, decimal_places=2)
    current_volume_liters = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self) -> str:
        return f"{self.name} ({self.current_volume_liters}/{self.capacity_liters} L)"


class Sensor(models.Model):
    system = models.ForeignKey(WaterSystem, on_delete=models.CASCADE, related_name="sensors", null=True, blank=True, help_text="Optional: can be auto-created from MQTT without system")
    device_id = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return f"{self.device_id} ({self.system})"


class SensorReading(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name="readings")
    recorded_at = models.DateTimeField(auto_now_add=True)
    distance_cm = models.FloatField(null=True, blank=True, help_text="Distance from sensor to water surface in cm")
    water_level = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    humidity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    soil_moisture = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    motion_detected = models.BooleanField(default=False)

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self) -> str:
        return f"{self.sensor.device_id} @ {self.recorded_at}"


class WaterDemandUnit(models.Model):
    class DemandCategory(models.TextChoices):
        HUMAN = "human", "Human"
        LIVESTOCK = "livestock", "Livestock"
        CROP = "crop", "Crop"

    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="demand_units")
    category = models.CharField(max_length=16, choices=DemandCategory.choices)
    name = models.CharField(max_length=120)
    count = models.PositiveIntegerField(default=1)
    area_hectares = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    daily_need_liters = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self) -> str:
        return f"{self.name} ({self.category})"


class ClimateSnapshot(models.Model):
    class Season(models.TextChoices):
        XAGAA = "xagaa", "Xagaa"
        GU = "gu", "Gu'"
        DAYR = "dayr", "Dayr"

    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="climate_snapshots")
    season = models.CharField(max_length=12, choices=Season.choices)
    days_until_rainfall = models.PositiveIntegerField()
    source = models.CharField(max_length=64, default="FAO_SWALIM")
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-recorded_at"]

    def __str__(self) -> str:
        return f"{self.location} {self.season} ({self.days_until_rainfall}d)"


class WaterPlan(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        ARCHIVED = "archived", "Archived"

    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="water_plans")
    system = models.ForeignKey(WaterSystem, on_delete=models.SET_NULL, null=True, blank=True, related_name="water_plans")
    plan_text = models.TextField()
    date_start = models.DateField()
    date_end = models.DateField()
    priority_rules = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.owner} plan {self.date_start} - {self.date_end} ({self.status})"

