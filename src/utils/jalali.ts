import moment from 'moment-jalaali';

// Set Persian locale for better display
moment.locale('fa');

/**
 * Converts a Gregorian date string to Jalali (Persian) format
 * @param dateString - The date string in ISO format or any valid date format
 * @param format - The output format (default: 'jYYYY/jMM/jDD HH:mm')
 * @returns Formatted Jalali date string
 */
export const toJalali = (dateString: string, format: string = 'jYYYY/jMM/jDD HH:mm'): string => {
  if (!dateString) return '';
  
  try {
    const momentDate = moment(dateString);
    if (!momentDate.isValid()) {
      console.warn('Invalid date string:', dateString);
      return dateString; // Return original if invalid
    }
    
    return momentDate.format(format);
  } catch (error) {
    console.error('Error converting date to Jalali:', error);
    return dateString; // Return original on error
  }
};

/**
 * Converts a Gregorian date string to Jalali date only (without time)
 * @param dateString - The date string in ISO format
 * @returns Formatted Jalali date string (YYYY/MM/DD format)
 */
export const toJalaliDate = (dateString: string): string => {
  return toJalali(dateString, 'jYYYY/jMM/jDD');
};

/**
 * Converts a Gregorian date string to Jalali date and time
 * @param dateString - The date string in ISO format
 * @returns Formatted Jalali date and time string
 */
export const toJalaliDateTime = (dateString: string): string => {
  return toJalali(dateString, 'jYYYY/jMM/jDD HH:mm');
};

/**
 * Converts a Gregorian date string to Jalali with better formatting for display
 * @param dateString - The date string in ISO format
 * @returns Formatted Jalali date string optimized for table display
 */
export const toJalaliDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const momentDate = moment(dateString);
    if (!momentDate.isValid()) {
      return dateString;
    }
    
    // Format: 1403/09/15 - 14:30
    return momentDate.format('jYYYY/jMM/jDD');
  } catch (error) {
    console.error('Error converting date to Jalali display:', error);
    return dateString;
  }
};

/**
 * Converts a Gregorian date string to Jalali with Persian month names
 * @param dateString - The date string in ISO format
 * @returns Formatted Jalali date with Persian month names
 */
export const toJalaliPersian = (dateString: string): string => {
  return toJalali(dateString, 'jYYYY jMMMM jDD');
};

/**
 * Gets relative time in Persian (e.g., "2 روز پیش")
 * @param dateString - The date string in ISO format
 * @returns Relative time string in Persian
 */
export const toJalaliRelative = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const momentDate = moment(dateString);
    if (!momentDate.isValid()) {
      return dateString;
    }
    
    // Set locale to Persian for relative time
    moment.locale('fa');
    return momentDate.fromNow();
  } catch (error) {
    console.error('Error converting to relative Jalali time:', error);
    return dateString;
  }
};
