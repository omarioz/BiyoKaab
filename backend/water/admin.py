from django.contrib import admin

from . import models


@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "latitude", "longitude")
    search_fields = ("name", "region")


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "user_type", "location")
    list_filter = ("user_type",)
    search_fields = ("user__username", "user__email")


@admin.register(models.WaterSystem)
class WaterSystemAdmin(admin.ModelAdmin):
    list_display = ("name", "system_type", "owner", "location")
    list_filter = ("system_type",)
    search_fields = ("name", "owner__user__username")


@admin.register(models.WaterStorage)
class WaterStorageAdmin(admin.ModelAdmin):
    list_display = ("name", "system", "capacity_liters", "current_volume_liters")


@admin.register(models.Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ("device_id", "system")
    search_fields = ("device_id",)


@admin.register(models.SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ("sensor", "recorded_at", "water_level", "humidity", "temperature")
    list_filter = ("sensor",)


@admin.register(models.WaterDemandUnit)
class WaterDemandUnitAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "owner", "daily_need_liters", "count")
    list_filter = ("category",)


@admin.register(models.ClimateSnapshot)
class ClimateSnapshotAdmin(admin.ModelAdmin):
    list_display = ("location", "season", "days_until_rainfall", "recorded_at")
    list_filter = ("season",)


@admin.register(models.WaterPlan)
class WaterPlanAdmin(admin.ModelAdmin):
    list_display = ("owner", "status", "date_start", "date_end", "created_at")
    list_filter = ("status",)

