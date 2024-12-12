/**
 * @module formatDate
 * @description Formats a date string or Date object without changing the timezone
 *
 * @param {Date | string} value - The date to format
 * @returns {string} Formatted date string
 *
 * @example
 * const formattedDate = formatDate('2023-01-01T00:00:00Z');
 */
export const formatDate = (value: Date | string): string => {
  if (!value) return '';

  try {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) return '';

    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');

    return `${month}/${day}/${year}`;
  } catch (error) {
    return '';
  }
};

/**
 * @module convertUTCToLocal
 * @description Converts a UTC date to a local date string
 *
 * @param {Date | string} value - The UTC date to convert
 * @returns {string} Local date string
 *
 * @example
 * const localDate = convertUTCToLocal('2023-01-01T00:00:00Z');
 */
export const convertUTCToLocal = (value: Date | string): string => {
  if (!value) return '';

  try {
    const utcDate = value instanceof Date ? value : new Date(value);

    if (isNaN(utcDate.getTime())) return '';

    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

    const month = localDate.toLocaleString('en-US', { month: 'long' });
    const year = localDate.getFullYear();
    const day = localDate.getDate().toString().padStart(2, '0');
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes().toString().padStart(2, '0');

    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');

    return `${month}/${day}/${year}, ${hour12}:${minutes} ${period}`;
  } catch (error) {
    return '';
  }
};

/**
 * @module convertUTCToLocalDate
 * @description Converts a UTC date to a local date string (date only)
 *
 * @param {Date | string} value - The UTC date to convert
 * @returns {string} Local date string (date only)
 *
 * @example
 * const localDate = convertUTCToLocalDate('2023-01-01T00:00:00Z');
 */
export const convertUTCToLocalDate = (value: Date | string): string => {
  if (!value) return '';

  try {
    const utcDate = value instanceof Date ? value : new Date(value);

    if (isNaN(utcDate.getTime())) return '';

    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

    const month = localDate.toLocaleString('en-US', { month: 'long' });
    const year = localDate.getFullYear();
    const day = localDate.getDate().toString().padStart(2, '0');

    return `${month}/${day}/${year}`;
  } catch (error) {
    return '';
  }
};

/**
 * @module convertUTCToLocalTime
 * @description Converts a UTC date to a local time string (time only)
 *
 * @param {Date | string} value - The UTC date to convert
 * @returns {string} Local time string (time only)
 *
 * @example
 * const localTime = convertUTCToLocalTime('2023-01-01T00:00:00Z');
 */
export const convertUTCToLocalTime = (value: Date | string): string => {
  if (!value) return '';

  try {
    const utcDate = value instanceof Date ? value : new Date(value);

    if (isNaN(utcDate.getTime())) return '';

    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

    const hours = localDate.getHours();
    const minutes = localDate.getMinutes().toString().padStart(2, '0');

    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = (hours % 12 || 12).toString().padStart(2, '0');

    return `${hour12}:${minutes} ${period}`;
  } catch (error) {
    return '';
  }
};
