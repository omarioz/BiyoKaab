from datetime import datetime
from typing import Optional

from water.models import ClimateSnapshot, Location


class FAOSwalimClient:
    """
    Placeholder FAO SWALIM client.
    In production, replace the stub with HTTP calls to FAO APIs.
    """

    def fetch_snapshot(self, location: Location) -> Optional[ClimateSnapshot]:
        # Stubbed response to unblock integration; saves to DB for traceability.
        return ClimateSnapshot.objects.create(
            location=location,
            season=ClimateSnapshot.Season.XAGAA,
            days_until_rainfall=14,
            source="FAO_SWALIM_MOCK",
            recorded_at=datetime.utcnow(),
        )





