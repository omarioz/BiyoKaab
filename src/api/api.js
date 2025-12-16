/**
 * Real API service that connects to the Django backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        data: null,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error',
      data: null,
    };
  }
}

export const api = {
  /**
   * GET /api/devices/status/?device_id=<deviceId>
   * Get device status with water tank data calculated from distance_cm
   */
  async getDeviceStatus(deviceId) {
    return apiRequest(`/devices/status/?device_id=${encodeURIComponent(deviceId)}`);
  },

  /**
   * GET /api/readings/latest/?device_id=<deviceId>
   * Get latest raw sensor reading
   */
  async getLatestReading(deviceId) {
    return apiRequest(`/readings/latest/?device_id=${encodeURIComponent(deviceId)}`);
  },
};





