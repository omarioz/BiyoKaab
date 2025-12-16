import { mockDevices, mockDeviceStatus, generateTimeSeriesData, mockHistoryEvents, mockAIRecommendations, mockWeatherForecast } from '../data/mockData';

/**
 * Mock API service that simulates backend endpoints
 * Returns promises with realistic delays
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  /**
   * GET /api/v1/devices
   */
  async getDevices() {
    await delay(300);
    return {
      success: true,
      data: mockDevices,
    };
  },

  /**
   * GET /api/v1/devices/:id/status
   */
  async getDeviceStatus(deviceId) {
    await delay(300);
    if (deviceId === 'AQUA001') {
      return {
        success: true,
        data: { ...mockDeviceStatus, device_id: deviceId },
      };
    }
    return {
      success: false,
      error: 'Device not found',
    };
  },

  /**
   * GET /api/v1/devices/:id/timeseries
   */
  async getTimeSeries(deviceId, range = '7d') {
    await delay(400);
    const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 7;
    return {
      success: true,
      data: {
        series: generateTimeSeriesData(days),
      },
    };
  },

  /**
   * POST /api/v1/sensor-data
   */
  async postSensorData(data) {
    await delay(500);
    return {
      success: true,
      data: {
        ...data,
        received_at: new Date().toISOString(),
      },
    };
  },

  /**
   * GET /api/v1/schedules
   */
  async getSchedules(deviceId) {
    await delay(200);
    return {
      success: true,
      data: mockDeviceStatus.schedules,
    };
  },

  /**
   * POST /api/v1/schedules
   */
  async createSchedule(schedule) {
    await delay(400);
    return {
      success: true,
      data: {
        ...schedule,
        id: `s${Date.now()}`,
        created_at: new Date().toISOString(),
      },
    };
  },

  /**
   * PUT /api/v1/schedules/:id
   */
  async updateSchedule(scheduleId, schedule) {
    await delay(400);
    return {
      success: true,
      data: {
        ...schedule,
        id: scheduleId,
        updated_at: new Date().toISOString(),
      },
    };
  },

  /**
   * DELETE /api/v1/schedules/:id
   */
  async deleteSchedule(scheduleId) {
    await delay(300);
    return {
      success: true,
      data: { id: scheduleId },
    };
  },

  /**
   * GET /api/v1/alerts
   */
  async getAlerts(deviceId) {
    await delay(200);
    return {
      success: true,
      data: mockDeviceStatus.alerts,
    };
  },

  /**
   * POST /api/v1/alerts/:id/acknowledge
   */
  async acknowledgeAlert(alertId) {
    await delay(300);
    return {
      success: true,
      data: {
        id: alertId,
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
      },
    };
  },

  /**
   * GET /api/v1/history
   */
  async getHistory(deviceId, filters = {}) {
    await delay(300);
    let events = [...mockHistoryEvents];
    
    if (filters.type) {
      events = events.filter(e => e.type === filters.type);
    }
    if (filters.startDate) {
      events = events.filter(e => new Date(e.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      events = events.filter(e => new Date(e.timestamp) <= new Date(filters.endDate));
    }

    return {
      success: true,
      data: events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    };
  },

  /**
   * GET /api/v1/forecast
   */
  async getForecast(deviceId) {
    await delay(300);
    return {
      success: true,
      data: mockWeatherForecast,
    };
  },

  /**
   * GET /api/v1/recommendations
   */
  async getRecommendations(deviceId) {
    await delay(400);
    return {
      success: true,
      data: mockAIRecommendations,
    };
  },
};







