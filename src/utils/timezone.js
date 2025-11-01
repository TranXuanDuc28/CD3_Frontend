// Frontend timezone utilities for Vietnam timezone (UTC+7)

/**
 * Convert datetime-local input value to Vietnam timezone ISO string
 * @param {string} datetimeLocalValue - Value from datetime-local input (YYYY-MM-DDTHH:MM)
 * @returns {string} - ISO string in Vietnam timezone
 */
export function toVietnamISOString(datetimeLocalValue) {
  if (!datetimeLocalValue) return null;
  
  // Create date from local input (browser interprets as local time)
  const localDate = new Date(datetimeLocalValue);
  
  // Get Vietnam timezone offset (+7 hours = 420 minutes)
  const vietnamOffset = 7 * 60; // 420 minutes
  
  // Convert to Vietnam time by adding the offset
  const vietnamTime = new Date(localDate.getTime() + (vietnamOffset * 60 * 1000));
  
  return vietnamTime.toISOString();
}

/**
 * Convert Vietnam timezone ISO string to datetime-local input value
 * @param {string} vietnamISOString - ISO string from backend
 * @returns {string} - Value for datetime-local input
 */
export function fromVietnamISOString(vietnamISOString) {
  if (!vietnamISOString) return '';
  
  // Create date from ISO string
  const date = new Date(vietnamISOString);
  
  // Get Vietnam timezone offset (+7 hours = 420 minutes)
  const vietnamOffset = 7 * 60; // 420 minutes
  
  // Convert from Vietnam time to local time by subtracting the offset
  const localTime = new Date(date.getTime() - (vietnamOffset * 60 * 1000));
  
  return localTime.toISOString().slice(0, 16);
}

/**
 * Format date to Vietnam timezone string for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} - Formatted date string
 */
export function formatVietnamTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  // Get Vietnam timezone offset (+7 hours = 420 minutes)
  const vietnamOffset = 7 * 60;
  const vietnamTime = new Date(dateObj.getTime() + (vietnamOffset * 60 * 1000));
  
  // Format based on requested format
  switch (format) {
    case 'YYYY-MM-DD HH:mm:ss':
      return vietnamTime.toISOString().slice(0, 19).replace('T', ' ');
    case 'YYYY-MM-DD':
      return vietnamTime.toISOString().slice(0, 10);
    case 'HH:mm:ss':
      return vietnamTime.toISOString().slice(11, 19);
    case 'MM/DD/YYYY':
      return vietnamTime.toLocaleDateString('en-US');
    case 'DD/MM/YYYY':
      return vietnamTime.toLocaleDateString('en-GB');
    default:
      return vietnamTime.toISOString().slice(0, 19).replace('T', ' ');
  }
}

/**
 * Get current time in Vietnam timezone
 * @returns {Date} - Current time in Vietnam timezone
 */
export function getVietnamNow() {
  const now = new Date();
  const vietnamOffset = 7 * 60; // 420 minutes
  return new Date(now.getTime() + (vietnamOffset * 60 * 1000));
}

/**
 * Add time to a date in Vietnam timezone
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to add
 * @param {string} unit - Unit ('minutes', 'hours', 'days')
 * @returns {Date} - New date
 */
export function addVietnamTime(date, amount, unit) {
  const baseDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamTime = new Date(baseDate.getTime() + (vietnamOffset * 60 * 1000));
  
  let newTime;
  switch (unit) {
    case 'minutes':
      newTime = new Date(vietnamTime.getTime() + (amount * 60 * 1000));
      break;
    case 'hours':
      newTime = new Date(vietnamTime.getTime() + (amount * 60 * 60 * 1000));
      break;
    case 'days':
      newTime = new Date(vietnamTime.getTime() + (amount * 24 * 60 * 60 * 1000));
      break;
    default:
      newTime = vietnamTime;
  }
  
  return newTime;
}

/**
 * Subtract time from a date in Vietnam timezone
 * @param {string|Date} date - Base date
 * @param {number} amount - Amount to subtract
 * @param {string} unit - Unit ('minutes', 'hours', 'days')
 * @returns {Date} - New date
 */
export function subtractVietnamTime(date, amount, unit) {
  const baseDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamTime = new Date(baseDate.getTime() + (vietnamOffset * 60 * 1000));
  
  let newTime;
  switch (unit) {
    case 'minutes':
      newTime = new Date(vietnamTime.getTime() - (amount * 60 * 1000));
      break;
    case 'hours':
      newTime = new Date(vietnamTime.getTime() - (amount * 60 * 60 * 1000));
      break;
    case 'days':
      newTime = new Date(vietnamTime.getTime() - (amount * 24 * 60 * 60 * 1000));
      break;
    default:
      newTime = vietnamTime;
  }
  
  return newTime;
}

/**
 * Check if a date is in the past (Vietnam timezone)
 * @param {string|Date} date - Date to check
 * @returns {boolean} - True if date is in the past
 */
export function isPastVietnamTime(date) {
  if (!date) return false;
  
  const checkDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamCheckTime = new Date(checkDate.getTime() + (vietnamOffset * 60 * 1000));
  
  return vietnamCheckTime < getVietnamNow();
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - Date to compare
 * @returns {string} - Relative time string
 */
export function getRelativeVietnamTime(date) {
  if (!date) return '';
  
  const checkDate = new Date(date);
  const vietnamOffset = 7 * 60;
  const vietnamCheckTime = new Date(checkDate.getTime() + (vietnamOffset * 60 * 1000));
  const now = getVietnamNow();
  
  const diffMs = vietnamCheckTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMs < 0) {
    // Past
    if (Math.abs(diffMinutes) < 60) {
      return `${Math.abs(diffMinutes)} minutes ago`;
    } else if (Math.abs(diffHours) < 24) {
      return `${Math.abs(diffHours)} hours ago`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  } else {
    // Future
    if (diffMinutes < 60) {
      return `in ${diffMinutes} minutes`;
    } else if (diffHours < 24) {
      return `in ${diffHours} hours`;
    } else {
      return `in ${diffDays} days`;
    }
  }
}
