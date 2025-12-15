/**
 * API service for AI chat functionality
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Send a chat message to the AI endpoint
 * @param {string} user_id - User ID
 * @param {Array<{role: string, content: string}>} messages - Array of message objects with role and content
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const sendChatMessage = async (user_id, messages) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to send chat message',
    };
  }
};

/**
 * Generate a water plan using AI
 * @param {string} user_id - User ID
 * @param {number} horizon_days - Number of days for the plan (default: 7)
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const generateWaterPlan = async (user_id, horizon_days = 7) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        horizon_days,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to generate water plan',
    };
  }
};

/**
 * Get active water plan for a user
 * @param {string} user_id - User ID
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const getActivePlan = async (user_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/active/?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'No active plan found',
        };
      }
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to get active plan',
    };
  }
};

