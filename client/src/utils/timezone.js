/**
 * Timezone Utility Functions
 * Handles conversion to Indian Standard Time (IST) for consistent display
 */

/**
 * Convert any date to Indian Standard Time
 * @param {Date|string} date - Date to convert
 * @returns {Date} Date object in IST
 */
export const toIST = (date) => {
  const dateObj = new Date(date);
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + istOffset);
};

/**
 * Format date in IST with Indian locale
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string in IST
 */
export const formatIST = (date, options = {}) => {
  const defaultOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return new Date(date).toLocaleString('en-IN', { ...defaultOptions, ...options });
};

/**
 * Format date for appointment display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted appointment date
 */
export const formatAppointmentDate = (date) => {
  return formatIST(date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date for booking display (short format)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted booking date
 */
export const formatBookingDate = (date) => {
  return formatIST(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format date for report display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted report date
 */
export const formatReportDate = (date) => {
  return formatIST(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get current IST time in datetime-local format
 * @returns {string} Current IST time formatted for datetime-local input
 */
export const getCurrentISTForInput = () => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return istTime.toISOString().slice(0, 16);
};

/**
 * Get current IST time
 * @returns {Date} Current time in IST
 */
export const getCurrentIST = () => {
  return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
};

/**
 * Check if a date is today in IST
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today in IST
 */
export const isToday = (date) => {
  const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  const checkDate = new Date(date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
  return today === checkDate;
};

/**
 * Check if a date is in the past in IST
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
  const now = new Date();
  const checkDate = new Date(date);
  return checkDate < now;
};

/**
 * Format time for report availability
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time
 */
export const formatReportAvailableTime = (date) => {
  return formatIST(date, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
