from django.contrib import admin
from biyokaab.models import SensorReading


@admin.register(SensorReading)
class SensorReadingAdmin(admin.ModelAdmin):
    list_display = ["device_id", "distance_cm", "water_level", "humidity", "temperature", "created_at"]
    list_filter = ["device_id", "created_at"]
    search_fields = ["device_id"]
    readonly_fields = ["created_at"]
    date_hierarchy = "created_at"

