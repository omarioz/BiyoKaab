from decimal import Decimal
from typing import Iterable

from water.models import WaterDemandUnit


class DemandEngine:
    """Aggregates daily water demand for people, livestock, and crops."""

    def daily_demand(self, demand_units: Iterable[WaterDemandUnit]) -> dict:
        totals = {"human": Decimal("0"), "livestock": Decimal("0"), "crop": Decimal("0")}
        for unit in demand_units:
            totals[unit.category] += unit.daily_need_liters * unit.count

        total = sum(totals.values())
        return {"totals": {k: float(v) for k, v in totals.items()}, "total_daily_liters": float(total)}





