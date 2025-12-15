from decimal import Decimal
from typing import Iterable

from water.models import SensorReading, WaterStorage


class WaterAvailabilityEngine:
    """Calculates usable water based on current tank volumes and latest readings."""

    def calculate(self, storages: Iterable[WaterStorage], latest_readings: dict[str, SensorReading] | None = None) -> dict:
        total_available = Decimal("0")
        systems_breakdown: list[dict] = []

        for storage in storages:
            total_available += storage.current_volume_liters
            systems_breakdown.append(
                {
                    "storage_id": storage.id,
                    "system_id": storage.system_id,
                    "name": storage.name,
                    "current_volume_liters": float(storage.current_volume_liters),
                    "capacity_liters": float(storage.capacity_liters),
                }
            )

        fog_capture_liters = Decimal("0")
        if latest_readings:
            for reading in latest_readings.values():
                if reading.water_level:
                    fog_capture_liters += reading.water_level

        return {
            "available_liters": float(total_available),
            "fog_capture_liters": float(fog_capture_liters),
            "breakdown": systems_breakdown,
        }

