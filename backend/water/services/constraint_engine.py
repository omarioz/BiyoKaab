from decimal import Decimal
from typing import Optional

from water.models import ClimateSnapshot


class ConstraintEngine:
    """Applies climatic constraints and produces a risk signal."""

    def evaluate(self, available_liters: float, daily_demand_liters: float, climate: Optional[ClimateSnapshot]) -> dict:
        available = Decimal(str(available_liters))
        daily_demand = Decimal(str(daily_demand_liters))

        if daily_demand > 0:
            days_of_supply = available / daily_demand
        else:
            days_of_supply = Decimal("0")

        rainfall_days = climate.days_until_rainfall if climate else None
        risk_level = self._risk(days_of_supply, rainfall_days)

        return {
            "days_of_supply": float(round(days_of_supply, 2)),
            "days_until_rainfall": rainfall_days,
            "risk_level": risk_level,
            "season": climate.season if climate else None,
        }

    @staticmethod
    def _risk(days_of_supply: Decimal, rainfall_days: Optional[int]) -> str:
        if rainfall_days is None:
            if days_of_supply < 3:
                return "critical"
            if days_of_supply < 7:
                return "high"
            return "moderate"

        if days_of_supply < rainfall_days:
            return "high" if days_of_supply < 5 else "moderate"
        return "low"





