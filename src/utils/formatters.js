import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format water volume with units
 */
export const formatVolume = (liters) => {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}k L`;
  }
  return `${liters.toFixed(1)} L`;
};

/**
 * Format percentage
 */
export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format temperature
 */
export const formatTemperature = (celsius) => {
  return `${celsius.toFixed(1)}°C`;
};

/**
 * Format relative time (e.g., "10 min ago")
 */
export const formatRelativeTime = (timestamp) => {
  try {
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format time
 */
export const formatTime = (date) => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'HH:mm');
  } catch (error) {
    return 'Invalid time';
  }
};

/**
 * Calculate days remaining based on usage rate
 */
export const calculateDaysRemaining = (currentVolume, capacity, dailyUsage) => {
  if (dailyUsage <= 0) return null;
  const remaining = capacity - currentVolume;
  return Math.floor(remaining / dailyUsage);
};



