import os
from datetime import date, timedelta
from typing import Any

from openai import OpenAI

from water.models import ClimateSnapshot, UserProfile, WaterPlan, WaterStorage, WaterSystem, WaterDemandUnit


class AIPlannerService:
    """Handles structured calls to OpenAI to generate water plans."""

    def __init__(self, model: str | None = None):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not configured.")
        self.client = OpenAI(api_key=api_key)
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def build_prompt(
        self,
        profile: UserProfile,
        systems: list[WaterSystem],
        storages: list[WaterStorage],
        demand_units: list[WaterDemandUnit],
        climate: ClimateSnapshot | None,
        horizon_days: int,
    ) -> str:
        # Somali first; keep concise and action oriented per requirements.
        demand_lines = "\n".join(
            [f"- {u.category}: {u.count} x {u.name} -> {u.daily_need_liters} L/d" for u in demand_units]
        )
        storage_lines = "\n".join(
            [
                f"- {s.name}: {s.current_volume_liters} / {s.capacity_liters} L (system {s.system_id})"
                for s in storages
            ]
        )
        systems_lines = "\n".join([f"- {s.name}: {s.system_type}" for s in systems])

        climate_text = (
            f"Xilli: {climate.season}, Roob: {climate.days_until_rainfall} maalmood."
            if climate
            else "Xog roob: lama hayo."
        )

        return f"""
Samee jadwal biyo oo {horizon_days} maalmood ah oo ku qoran Soomaali.
Ka fogow khasaaro, mudnee badbaado: dadka -> xoolaha -> dalagga.
Ha xusin AI.

Macluumaad isticmaal:
- Nooca isticmaale: {profile.user_type}
- Goob: {profile.location.region if profile.location else "lama cayimin"}
- Nidaamyada ceeryaanta:
{systems_lines or "- lama hayo"}
- Haamaha:
{storage_lines or "- lama hayo"}
- Baahida biyo maalintii:
{demand_lines or "- lama hayo"}
- Xaalad cimilada: {climate_text}
Wax soo saar: liis maalinle ah oo leh qiyaasta litir, mudnaanta (aad u sare, sare, caadi), sabab kooban, iyo talo kaydin.
"""

    def generate_plan(
        self,
        profile: UserProfile,
        systems: list[WaterSystem],
        storages: list[WaterStorage],
        demand_units: list[WaterDemandUnit],
        climate: ClimateSnapshot | None,
        horizon_days: int,
    ) -> str:
        prompt = self.build_prompt(profile, systems, storages, demand_units, climate, horizon_days)
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a water management assistant helping farmers and nomads in Somalia manage their water resources efficiently."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=800,
        )
        return completion.choices[0].message.content

    def store_plan(
        self,
        profile: UserProfile,
        system: WaterSystem | None,
        plan_text: str,
        priority_rules: dict[str, Any],
        horizon_days: int,
    ) -> WaterPlan:
        today = date.today()
        return WaterPlan.objects.create(
            owner=profile,
            system=system,
            plan_text=plan_text,
            date_start=today,
            date_end=today + timedelta(days=horizon_days),
            priority_rules=priority_rules,
            status=WaterPlan.Status.ACTIVE,
        )

    def chat(
        self,
        messages: list[dict[str, str]],
        context: dict[str, Any] | None = None,
    ) -> str:
        """Handle conversational chat with context awareness."""
        system_message = {
            "role": "system",
            "content": """You are Biyokaab AI, a helpful water management assistant for farmers and nomads in Somalia. 
You help users understand their water systems, provide recommendations, and answer questions about:
- Water usage and conservation
- Irrigation planning
- Livestock watering schedules
- Sensor readings and system health
- Climate and rainfall patterns
- Water storage management

Be concise, practical, and culturally aware. You can respond in Somali or English based on the user's preference."""
        }
        
        # Add context if provided
        if context:
            context_text = f"""
Current system context:
- Available water: {context.get('available_liters', 0)} liters
- Daily demand: {context.get('daily_demand_liters', 0)} liters
- Storage capacity: {context.get('storage_capacity', 0)} liters
- Climate: {context.get('climate_info', 'Not available')}
"""
            system_message["content"] += context_text

        # Build messages list with system message first
        chat_messages = [system_message] + messages

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=chat_messages,
            temperature=0.7,
            max_tokens=1000,
        )
        
        if not completion.choices or len(completion.choices) == 0:
            raise ValueError("OpenAI API returned no choices")
        
        response_content = completion.choices[0].message.content
        if not response_content:
            raise ValueError("OpenAI API returned empty response")
        
        return response_content

