# Biyo Kaab Backend (Django + DRF)

## Setup
- Create virtualenv and install requirements:
  - `python -m venv .venv && .venv\Scripts\activate` (Windows) or `source .venv/bin/activate` (Unix)
  - `pip install -r requirements.txt`
- Copy `env.example` to `.env` and fill values (PostgreSQL recommended; SQLite works for dev).
- **Important**: Set your OpenAI API key in `.env`:
  - `OPENAI_API_KEY=sk-your-api-key-here`
  - Optionally set `OPENAI_MODEL=gpt-4o-mini` (default) or another model like `gpt-4o`
- Run migrations and start server:
  - `python manage.py migrate`
  - `python manage.py runserver`

## API Endpoints
- `POST /api/iot/ingest/` – ingest sensor readings (by `device_id`).
- `GET /api/dashboard/?user_id=<id>` – aggregated status for dashboard cards.
- `GET /api/sensors/history/?device_id=<id>` – latest readings history.
- `POST /api/plans/generate/` – generate water plan via OpenAI (requires `OPENAI_API_KEY`).
- `GET /api/plans/active/?user_id=<id>` – fetch the active plan.
- `POST /api/ai/chat/` – conversational AI chat endpoint (requires `OPENAI_API_KEY`).

## Key Services
- `WaterAvailabilityEngine` – sums usable water (tank + fog input).
- `DemandEngine` – totals daily water needs.
- `ConstraintEngine` – applies seasonal/rainfall constraints and risk.
- `AIPlannerService` – isolated OpenAI calls; never touches raw sensor input.
- `FAOSwalimClient` – placeholder for climate data (replace stub with real API).

