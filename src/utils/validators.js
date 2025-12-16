/**
 * Validation utilities for forms
 */

export const validateRequired = (value) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return true;
};

export const validateNumber = (value, min = null, max = null) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Please enter a valid number';
  }
  if (min !== null && num < min) {
    return `Value must be at least ${min}`;
  }
  if (max !== null && num > max) {
    return `Value must be at most ${max}`;
  }
  return true;
};

export const validatePositive = (value) => {
  return validateNumber(value, 0);
};







