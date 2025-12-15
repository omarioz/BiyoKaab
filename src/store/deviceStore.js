import { create } from 'zustand';
import { mockApi } from '../api/mockApi';

/**
 * Zustand store for device data and sensor readings
 */
export const useDeviceStore = create((set, get) => ({
  // State
  devices: [],
  currentDeviceId: null,
  deviceStatus: null,
  timeSeriesData: null,
  schedules: [],
  alerts: [],
  history: [],
  forecast: null,
  recommendations: [],
  loading: false,
  error: null,

  // Actions
  setCurrentDevice: (deviceId) => {
    set({ currentDeviceId: deviceId });
    get().fetchDeviceStatus(deviceId);
    get().fetchTimeSeries(deviceId);
    get().fetchSchedules(deviceId);
    get().fetchAlerts(deviceId);
    get().fetchHistory(deviceId);
    get().fetchForecast(deviceId);
    get().fetchRecommendations(deviceId);
  },

  fetchDevices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await mockApi.getDevices();
      if (response.success) {
        set({ devices: response.data, loading: false });
        // Set first device as current if none selected
        if (!get().currentDeviceId && response.data.length > 0) {
          get().setCurrentDevice(response.data[0].id);
        }
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDeviceStatus: async (deviceId) => {
    try {
      const response = await mockApi.getDeviceStatus(deviceId);
      if (response.success) {
        set({ deviceStatus: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchTimeSeries: async (deviceId, range = '7d') => {
    try {
      const response = await mockApi.getTimeSeries(deviceId, range);
      if (response.success) {
        set({ timeSeriesData: response.data.series });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateSensorData: (data) => {
    // Optimistic update for real-time data
    const currentStatus = get().deviceStatus;
    if (currentStatus && currentStatus.device_id === data.device_id) {
      set({
        deviceStatus: {
          ...currentStatus,
          water_volume_l: data.water_volume_l,
          percent_full: (data.water_volume_l / currentStatus.tank_capacity_l) * 100,
          humidity_percent: data.humidity_percent,
          temperature_c: data.temperature_c,
          last_update: data.timestamp,
        },
      });
    }
  },

  fetchSchedules: async (deviceId) => {
    try {
      const response = await mockApi.getSchedules(deviceId);
      if (response.success) {
        set({ schedules: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  createSchedule: async (schedule) => {
    try {
      const response = await mockApi.createSchedule(schedule);
      if (response.success) {
        set({ schedules: [...get().schedules, response.data] });
        return response.data;
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateSchedule: async (scheduleId, schedule) => {
    try {
      const response = await mockApi.updateSchedule(scheduleId, schedule);
      if (response.success) {
        set({
          schedules: get().schedules.map(s =>
            s.id === scheduleId ? response.data : s
          ),
        });
        return response.data;
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteSchedule: async (scheduleId) => {
    try {
      const response = await mockApi.deleteSchedule(scheduleId);
      if (response.success) {
        set({
          schedules: get().schedules.filter(s => s.id !== scheduleId),
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchAlerts: async (deviceId) => {
    try {
      const response = await mockApi.getAlerts(deviceId);
      if (response.success) {
        set({ alerts: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  acknowledgeAlert: async (alertId) => {
    try {
      const response = await mockApi.acknowledgeAlert(alertId);
      if (response.success) {
        set({
          alerts: get().alerts.map(a =>
            a.id === alertId ? { ...a, acknowledged: true } : a
          ),
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchHistory: async (deviceId, filters = {}) => {
    try {
      const response = await mockApi.getHistory(deviceId, filters);
      if (response.success) {
        set({ history: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchForecast: async (deviceId) => {
    try {
      const response = await mockApi.getForecast(deviceId);
      if (response.success) {
        set({ forecast: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },

  fetchRecommendations: async (deviceId) => {
    try {
      const response = await mockApi.getRecommendations(deviceId);
      if (response.success) {
        set({ recommendations: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    }
  },
}));



