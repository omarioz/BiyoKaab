# Backend Structure Explanation

## 📁 Overall Backend Architecture

```
backend/
├── biyo_kaab/              # Django project configuration
│   ├── settings.py         # Main Django settings
│   ├── urls.py             # Root URL configuration
│   ├── wsgi.py             # WSGI application
│   └── asgi.py             # ASGI application
│
├── water/                  # Main Django app (Water Management System)
│   ├── models.py           # All database models
│   ├── views/              # API view classes
│   │   ├── device_status.py    # Water tank status endpoint
│   │   ├── dashboard.py         # Dashboard summary
│   │   ├── sensors.py           # Sensor history
│   │   ├── ingest.py            # IoT data ingestion
│   │   ├── plans.py             # Water planning
│   │   └── ai_chat.py           # AI chat interface
│   ├── serializers.py      # DRF serializers
│   ├── urls.py             # API URL routing
│   ├── services/           # Business logic services
│   │   ├── availability_engine.py
│   │   ├── demand_engine.py
│   │   ├── constraint_engine.py
│   │   ├── ai_planner.py
│   │   └── weather_client.py
│   ├── management/commands/    # Django management commands
│   │   └── mqtt_listener.py    # MQTT data ingestion
│   └── migrations/         # Database migrations
│
├── manage.py               # Django management script
├── db.sqlite3              # SQLite database (dev)
└── requirements.txt        # Python dependencies
```

---

## 🗄️ Database Model Structure

### Model Hierarchy & Relationships

```
User (Django built-in)
  └── OneToOne → UserProfile
        ├── ForeignKey → Location (optional)
        ├── Reverse FK → WaterSystem (water_systems)
        ├── Reverse FK → WaterDemandUnit (demand_units)
        └── Reverse FK → WaterPlan (water_plans)

Location
  ├── Reverse FK → UserProfile (via location)
  ├── Reverse FK → WaterSystem (via location)
  └── Reverse FK → ClimateSnapshot (climate_snapshots)

UserProfile
  ├── OneToOne → User
  ├── ForeignKey → Location (optional)
  ├── Reverse FK → WaterSystem (water_systems)
  ├── Reverse FK → WaterDemandUnit (demand_units)
  └── Reverse FK → WaterPlan (water_plans)

WaterSystem
  ├── ForeignKey → UserProfile (owner)
  ├── ForeignKey → Location (optional)
  ├── Reverse FK → WaterStorage (storages)
  ├── Reverse FK → Sensor (sensors)
  └── Reverse FK → WaterPlan (water_plans)

WaterStorage
  └── ForeignKey → WaterSystem (system)

Sensor
  ├── ForeignKey → WaterSystem (system, optional - can be null)
  └── Reverse FK → SensorReading (readings)

SensorReading
  └── ForeignKey → Sensor (sensor)

WaterDemandUnit
  └── ForeignKey → UserProfile (owner)

ClimateSnapshot
  └── ForeignKey → Location (location)

WaterPlan
  ├── ForeignKey → UserProfile (owner)
  └── ForeignKey → WaterSystem (system, optional)
```

---

## 📊 Detailed Model Descriptions

### 1. **Location** (Geographic Data)
```python
Location
├── name: CharField(120)              # Location name
├── region: CharField(120)             # Region/area
├── latitude: DecimalField(8,5)        # GPS latitude (optional)
├── longitude: DecimalField(8,5)        # GPS longitude (optional)
└── description: TextField             # Additional info
```
**Purpose**: Stores geographic locations for users, systems, and climate data.

---

### 2. **UserProfile** (User Extension)
```python
UserProfile
├── user: OneToOneField(User)          # Links to Django User
├── user_type: CharField               # "farmer" or "nomad"
├── location: ForeignKey(Location)    # User's location (optional)
└── fog_system_type: CharField(50)    # Type of fog collection system
```
**Purpose**: Extends Django's built-in User model with water management specific fields.

**Relationships**:
- One user = One profile (1:1)
- One profile can have many water systems
- One profile can have many demand units
- One profile can have many water plans

---

### 3. **WaterSystem** (Fog Collection System)
```python
WaterSystem
├── name: CharField(120)               # System name
├── system_type: CharField             # "portable_fog_net" or "fixed_fog_net"
├── owner: ForeignKey(UserProfile)    # Who owns this system
└── location: ForeignKey(Location)   # Where it's located (optional)
```
**Purpose**: Represents a fog collection system (portable or fixed).

**Relationships**:
- Belongs to one UserProfile (owner)
- Can have multiple WaterStorage tanks
- Can have multiple Sensors
- Can be referenced by WaterPlans

---

### 4. **WaterStorage** (Water Tanks)
```python
WaterStorage
├── system: ForeignKey(WaterSystem)    # Which system owns this tank
├── name: CharField(120)               # Tank name (default: "Tank")
├── capacity_liters: DecimalField     # Maximum capacity
└── current_volume_liters: DecimalField  # Current water level
```
**Purpose**: Represents individual water storage tanks/containers.

**Relationships**:
- Belongs to one WaterSystem
- One system can have multiple tanks

---

### 5. **Sensor** (IoT Devices)
```python
Sensor
├── system: ForeignKey(WaterSystem)    # Which system (optional - can be null)
├── device_id: CharField(64, unique)  # Unique device identifier (e.g., "AQUA001")
└── description: CharField(255)       # Device description
```
**Purpose**: Represents IoT sensors that send telemetry data.

**Key Features**:
- `system` can be `null` - allows auto-creation from MQTT without pre-registration
- `device_id` is unique - used to identify devices in API calls
- Auto-created by MQTT listener when receiving data

**Relationships**:
- Optionally belongs to a WaterSystem
- Has many SensorReading records (via `readings` reverse FK)

---

### 6. **SensorReading** (Telemetry Data) ⭐ **CORE MODEL**
```python
SensorReading
├── sensor: ForeignKey(Sensor)         # Which sensor recorded this
├── recorded_at: DateTimeField        # When it was recorded (auto)
├── distance_cm: FloatField           # Distance to water surface (cm) ⭐ KEY FIELD
├── water_level: DecimalField         # Calculated water level (optional)
├── humidity: DecimalField            # Humidity percentage (optional)
├── temperature: DecimalField         # Temperature in Celsius (optional)
├── soil_moisture: DecimalField       # Soil moisture (optional)
└── motion_detected: BooleanField     # Motion detection (optional)
```
**Purpose**: Stores all IoT sensor telemetry data received via MQTT.

**Key Features**:
- `distance_cm` is the **critical field** - used to calculate water tank levels
- Automatically ordered by `recorded_at` descending (newest first)
- Created by MQTT listener when receiving sensor data
- Used by `/api/devices/status/` to calculate water volume

**Data Flow**:
```
MQTT Message → mqtt_listener.py → Creates SensorReading
  ↓
DeviceStatusView queries latest SensorReading
  ↓
Calculates: distance_cm → water_volume_l, percent_full
```

---

### 7. **WaterDemandUnit** (Water Requirements)
```python
WaterDemandUnit
├── owner: ForeignKey(UserProfile)     # Who needs this water
├── category: CharField                # "human", "livestock", or "crop"
├── name: CharField(120)              # Unit name
├── count: PositiveIntegerField       # Number of units (people/animals)
├── area_hectares: DecimalField       # Area for crops (optional)
└── daily_need_liters: DecimalField    # Daily water requirement
```
**Purpose**: Tracks water demand from different sources (people, animals, crops).

**Relationships**:
- Belongs to one UserProfile
- Used by demand engine to calculate total water needs

---

### 8. **ClimateSnapshot** (Weather/Rainfall Data)
```python
ClimateSnapshot
├── location: ForeignKey(Location)     # Which location
├── season: CharField                 # "xagaa", "gu", or "dayr"
├── days_until_rainfall: PositiveIntegerField  # Days until next rain
├── source: CharField(64)             # Data source (default: "FAO_SWALIM")
└── recorded_at: DateTimeField        # When recorded
```
**Purpose**: Stores climate/weather predictions for water planning.

**Relationships**:
- Belongs to one Location
- Used by constraint engine for risk assessment

---

### 9. **WaterPlan** (AI-Generated Plans)
```python
WaterPlan
├── owner: ForeignKey(UserProfile)     # Who the plan is for
├── system: ForeignKey(WaterSystem)   # Which system (optional)
├── plan_text: TextField              # AI-generated plan text
├── date_start: DateField             # Plan start date
├── date_end: DateField               # Plan end date
├── priority_rules: JSONField         # Priority rules (JSON)
├── status: CharField                  # "active" or "archived"
└── created_at: DateTimeField         # When created
```
**Purpose**: Stores AI-generated water management plans.

**Relationships**:
- Belongs to one UserProfile
- Optionally linked to a WaterSystem

---

## 🔄 Data Flow Example: Water Tank Status

### Complete Flow from MQTT to API Response

```
1. MQTT Message Received
   └── Topic: "biyokaab/AQUA001/telemetry"
   └── Payload: {"device_id": "AQUA001", "distance_cm": 38.3, ...}

2. mqtt_listener.py processes message
   ├── Extracts: device_id="AQUA001", distance_cm=38.3
   ├── Gets or creates: Sensor(device_id="AQUA001")
   └── Creates: SensorReading(sensor=..., distance_cm=38.3, ...)

3. API Request: GET /api/devices/status/?device_id=AQUA001
   └── DeviceStatusView.get() executes

4. View Logic:
   ├── Query: Sensor.objects.get(device_id="AQUA001")
   ├── Query: sensor.readings.order_by('-recorded_at').first()
   ├── Extract: latest_reading.distance_cm = 38.3
   ├── Calculate: water_height_cm = 100 - 38.3 = 61.7
   ├── Calculate: percent_full = (61.7 / 100) * 100 = 61.7%
   └── Calculate: water_volume_l = (61.7 / 100) * 200 = 123.4 L

5. Response:
   {
     "device_id": "AQUA001",
     "water_volume_l": 123.4,
     "tank_capacity_l": 200.0,
     "percent_full": 61.7,
     ...
   }
```

---

## 🎯 Key Design Decisions

### 1. **Sensor.system is Optional (null=True)**
- **Why**: Allows MQTT listener to auto-create sensors without requiring pre-registration
- **Benefit**: Sensors can start sending data immediately, system adapts automatically

### 2. **SensorReading.distance_cm is the Key Field**
- **Why**: This is what MQTT sends, and it's used to calculate everything else
- **Benefit**: Single source of truth for water level calculation

### 3. **All Models in One App (water)**
- **Why**: Everything is related to water management
- **Benefit**: Simpler structure, easier to understand relationships

### 4. **UserProfile Extends Django User**
- **Why**: Need water-specific user data without modifying Django's User model
- **Benefit**: Clean separation, can use Django's built-in authentication

---

## 📡 API Endpoints Structure

All endpoints are under `/api/` and defined in `water/urls.py`:

- `/api/devices/status/?device_id=AQUA001` → `DeviceStatusView` (calculates tank status)
- `/api/readings/latest/?device_id=AQUA001` → `LatestReadingView` (raw reading)
- `/api/sensors/history/?device_id=AQUA001` → `SensorHistoryView` (historical data)
- `/api/iot/ingest/` → `SensorIngestView` (POST sensor data)
- `/api/dashboard/` → `DashboardSummaryView` (dashboard summary)
- `/api/plans/generate/` → `GenerateWaterPlanView` (AI plan generation)
- `/api/plans/active/` → `ActivePlanView` (get active plan)
- `/api/ai/chat/` → `AIChatView` (AI chat interface)

---

## 🔧 Services Layer

Business logic is separated into services:

- **availability_engine.py**: Calculates available water from tanks
- **demand_engine.py**: Calculates water demand from units
- **constraint_engine.py**: Evaluates climate constraints and risk
- **ai_planner.py**: Generates water management plans using AI
- **weather_client.py**: Fetches weather/climate data

---

## 📝 Summary

The backend is a **Django REST Framework** application with:

1. **Single App Architecture**: All models in `water` app
2. **Hierarchical Relationships**: User → Profile → System → Sensor → Reading
3. **Flexible Sensor Creation**: Sensors can be auto-created from MQTT
4. **Core Data Model**: `SensorReading` with `distance_cm` is the heart of the system
5. **Service-Oriented**: Business logic separated into service classes
6. **RESTful APIs**: All endpoints follow REST conventions

The model structure supports:
- ✅ Multiple users with different profiles
- ✅ Multiple water systems per user
- ✅ Multiple sensors per system
- ✅ Continuous sensor readings via MQTT
- ✅ Water demand tracking
- ✅ Climate-aware planning
- ✅ AI-generated water management plans




