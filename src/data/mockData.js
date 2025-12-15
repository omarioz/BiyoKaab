/**
 * Mock data for the IoT Dashboard prototype
 * Matches the API specification examples
 */

// Sample device list
export const mockDevices = [
  {
    id: 'AQUA001',
    name: 'Main Reservoir',
    location: 'North Field',
    timezone: 'UTC',
    lastSeen: new Date().toISOString(),
    status: 'online',
  },
  {
    id: 'AQUA002',
    name: 'Secondary Tank',
    location: 'South Field',
    timezone: 'UTC',
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    status: 'offline',
  },
];

// Current device status (matches GET /api/v1/devices/:id/status)
export const mockDeviceStatus = {
  device_id: 'AQUA001',
  last_update: new Date().toISOString(),
  water_volume_l: 123.4,
  tank_capacity_l: 200,
  percent_full: 61.7,
  humidity_percent: 82.1,
  temperature_c: 18.7,
  days_until_expected_rain: 5,
  next_watering_recommendation: {
    target: 'plants',
    when: new Date(Date.now() + 18 * 3600000).toISOString(),
    amount_l: 10,
  },
  schedules: [
    {
      id: 's1',
      target: 'plants',
      next_run: new Date(Date.now() + 18 * 3600000).toISOString(),
      amount_l: 10,
      frequency: 'daily',
      name: 'Morning Plant Watering',
    },
    {
      id: 's2',
      target: 'livestock',
      next_run: new Date(Date.now() + 42 * 3600000).toISOString(),
      amount_l: 25,
      frequency: 'daily',
      name: 'Livestock Watering',
    },
  ],
  alerts: [
    {
      id: 'a1',
      type: 'low_water',
      level_percent: 12,
      ts: new Date(Date.now() - 86400000).toISOString(),
      message: 'Low water: Reservoir below 15% — take action',
      acknowledged: false,
    },
  ],
  device_health: {
    battery_percent: 85,
    battery_volt: 3.9,
    signal_strength: -60,
    firmware_version: '1.2.3',
    last_ping: new Date().toISOString(),
  },
};

// Time series data (matches GET /api/v1/devices/:id/timeseries)
export const generateTimeSeriesData = (days = 7) => {
  const now = Date.now();
  const points = days * 24; // Hourly data
  const data = {
    water_volume: [],
    humidity: [],
    temp: [],
    rain: [],
  };

  let baseWater = 120;
  let baseHumidity = 80;
  let baseTemp = 19;

  for (let i = points; i >= 0; i--) {
    const timestamp = now - (i * 3600000);
    
    // Simulate realistic variations
    baseWater += (Math.random() - 0.5) * 2;
    if (baseWater < 50) baseWater = 50;
    if (baseWater > 200) baseWater = 200;
    
    baseHumidity += (Math.random() - 0.5) * 3;
    if (baseHumidity < 40) baseHumidity = 40;
    if (baseHumidity > 95) baseHumidity = 95;
    
    baseTemp += (Math.random() - 0.5) * 1;
    if (baseTemp < 10) baseTemp = 10;
    if (baseTemp > 30) baseTemp = 30;

    data.water_volume.push([timestamp, Math.round(baseWater * 10) / 10]);
    data.humidity.push([timestamp, Math.round(baseHumidity * 10) / 10]);
    data.temp.push([timestamp, Math.round(baseTemp * 10) / 10]);
    data.rain.push([timestamp, Math.random() > 0.9 ? Math.random() * 5 : 0]);
  }

  return data;
};

// Historical events
export const mockHistoryEvents = [
  {
    id: 'e1',
    type: 'irrigation',
    target: 'plants',
    amount_l: 10,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
  },
  {
    id: 'e2',
    type: 'refill',
    amount_l: 50,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
  },
  {
    id: 'e3',
    type: 'irrigation',
    target: 'livestock',
    amount_l: 25,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed',
  },
];

// AI Recommendations
export const mockAIRecommendations = [
  {
    id: 'r1',
    priority: 'high',
    confidence: 'high',
    title: 'Reduce plant watering by 20% for next 3 days',
    description: 'Rain expected in 5 days. Save ~15 L/day',
    action: 'reduce_watering',
    target: 'plants',
    amount: -20,
    duration_days: 3,
  },
  {
    id: 'r2',
    priority: 'medium',
    confidence: 'medium',
    title: 'Check sensor calibration',
    description: 'Humidity readings seem inconsistent',
    action: 'calibrate',
  },
  {
    id: 'r3',
    priority: 'low',
    confidence: 'low',
    title: 'Consider increasing livestock schedule',
    description: 'Temperature rising, animals may need more water',
    action: 'increase_schedule',
    target: 'livestock',
  },
];

// Weather forecast data
export const mockWeatherForecast = {
  current: {
    temperature_c: 18.7,
    humidity_percent: 82.1,
    wind_speed_kmh: 12,
    condition: 'partly_cloudy',
  },
  forecast: {
    days_until_rain: 5,
    rain_probability: 40,
    precipitation_7day: [0, 0, 0, 0, 0, 2.5, 5.0], // mm per day
  },
};



