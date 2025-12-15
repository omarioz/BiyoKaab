from django.db import models


class SensorReading(models.Model):
    """
    Model to store IoT sensor telemetry data received via MQTT.
    """
    device_id = models.CharField(max_length=64, db_index=True)
    distance_cm = models.FloatField()
    water_level = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["device_id", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.device_id} @ {self.created_at}"

