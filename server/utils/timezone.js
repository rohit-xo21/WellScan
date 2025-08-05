/**
 * Server-side timezone utilities for Indian Standard Time
 */

/**
 * Convert date to IST and return ISO string
 * @param {Date} date - Date to convert
 * @returns {string} ISO string in IST
 */
const toIST = (date) => {
  const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return istDate;
};

/**
 * Get current time in IST
 * @returns {Date} Current IST time
 */
const getCurrentIST = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

/**
 * Format date for IST display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
const formatIST = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

module.exports = {
  toIST,
  getCurrentIST,
  formatIST
};
