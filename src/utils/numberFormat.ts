/**
 * Number Formatting Utilities
 * 
 * This utility provides comprehensive number formatting functions for the GateHide project.
 * It includes thousand separators, currency formatting, and input handling for Persian/English numbers.
 */

/**
 * Formats a number with thousand separators (commas)
 * @param value - The number or string to format
 * @returns Formatted string with thousand separators
 * 
 * @example
 * formatNumberWithCommas(1234567) // "1,234,567"
 * formatNumberWithCommas("1234567") // "1,234,567"
 * formatNumberWithCommas("1,234,567") // "1,234,567"
 */
export const formatNumberWithCommas = (value: string | number): string => {
  if (!value && value !== 0) return '';
  const numValue = typeof value === 'string' ? value.replace(/,/g, '') : value.toString();
  return numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Parses a formatted number string back to a numeric value
 * @param value - The formatted string to parse
 * @returns Numeric value
 * 
 * @example
 * parseFormattedNumber("1,234,567") // 1234567
 * parseFormattedNumber("1234567") // 1234567
 * parseFormattedNumber("") // 0
 */
export const parseFormattedNumber = (value: string): number => {
  if (!value) return 0;
  const cleanValue = value.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};

/**
 * Formats a number as currency with thousand separators
 * @param value - The number to format
 * @param currency - The currency symbol (default: "تومان")
 * @param locale - The locale for formatting (default: "fa-IR")
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234567) // "۱٬۲۳۴٬۵۶۷ تومان"
 * formatCurrency(1234567, "$") // "1,234,567 $"
 */
export const formatCurrency = (value: number, currency: string = "تومان", locale: string = "fa-IR"): string => {
  if (!value && value !== 0) return '';
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(value)} ${currency}`;
  } catch {
    // Fallback to manual formatting if Intl is not available
    return `${formatNumberWithCommas(value)} ${currency}`;
  }
};

/**
 * Formats a number as Persian currency (Toman)
 * @param value - The number to format
 * @returns Formatted Persian currency string
 * 
 * @example
 * formatPersianCurrency(1234567) // "۱٬۲۳۴٬۵۶۷ تومان"
 */
export const formatPersianCurrency = (value: number): string => {
  return formatCurrency(value, "تومان", "fa-IR");
};

/**
 * Formats a number as English currency (USD)
 * @param value - The number to format
 * @returns Formatted English currency string
 * 
 * @example
 * formatEnglishCurrency(1234567) // "1,234,567 $"
 */
export const formatEnglishCurrency = (value: number): string => {
  return formatCurrency(value, "$", "en-US");
};

/**
 * Validates if a string contains only valid number characters (digits, commas, dots)
 * @param value - The string to validate
 * @returns True if valid number string
 * 
 * @example
 * isValidNumberString("1,234.56") // true
 * isValidNumberString("1234") // true
 * isValidNumberString("abc") // false
 */
export const isValidNumberString = (value: string): boolean => {
  if (!value) return true; // Empty string is considered valid
  return /^[\d,.\s]*$/.test(value);
};

/**
 * Cleans a number string by removing all non-numeric characters except dots
 * @param value - The string to clean
 * @returns Cleaned numeric string
 * 
 * @example
 * cleanNumberString("1,234.56") // "1234.56"
 * cleanNumberString("1 234,56") // "1234.56"
 */
export const cleanNumberString = (value: string): string => {
  if (!value) return '';
  return value.replace(/[^\d.]/g, '');
};

/**
 * Formats a number with custom thousand and decimal separators
 * @param value - The number to format
 * @param thousandSeparator - Thousand separator (default: ",")
 * @param decimalSeparator - Decimal separator (default: ".")
 * @param decimalPlaces - Number of decimal places (default: 0)
 * @returns Formatted number string
 * 
 * @example
 * formatNumberWithSeparators(1234567.89, ",", ".", 2) // "1,234,567.89"
 * formatNumberWithSeparators(1234567, " ", ",", 0) // "1 234 567"
 */
export const formatNumberWithSeparators = (
  value: number,
  thousandSeparator: string = ",",
  decimalSeparator: string = ".",
  decimalPlaces: number = 0
): string => {
  if (!value && value !== 0) return '';
  
  const fixedValue = value.toFixed(decimalPlaces);
  const [integerPart, decimalPart] = fixedValue.split('.');
  
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  if (decimalPlaces > 0 && decimalPart) {
    return `${formattedInteger}${decimalSeparator}${decimalPart}`;
  }
  
  return formattedInteger;
};

/**
 * Converts Persian digits to English digits
 * @param value - String containing Persian digits
 * @returns String with English digits
 * 
 * @example
 * persianToEnglishDigits("۱۲۳۴۵۶۷") // "1234567"
 */
export const persianToEnglishDigits = (value: string): string => {
  if (!value) return '';
  
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = value;
  persianDigits.forEach((persian, index) => {
    result = result.replace(new RegExp(persian, 'g'), englishDigits[index]);
  });
  
  return result;
};

/**
 * Converts English digits to Persian digits
 * @param value - String containing English digits
 * @returns String with Persian digits
 * 
 * @example
 * englishToPersianDigits("1234567") // "۱۲۳۴۵۶۷"
 */
export const englishToPersianDigits = (value: string): string => {
  if (!value) return '';
  
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = value;
  englishDigits.forEach((english, index) => {
    result = result.replace(new RegExp(english, 'g'), persianDigits[index]);
  });
  
  return result;
};

/**
 * Formats a number for display in Persian locale
 * @param value - The number to format
 * @param showCurrency - Whether to show currency symbol (default: true)
 * @returns Formatted Persian number string
 * 
 * @example
 * formatPersianNumber(1234567) // "۱٬۲۳۴٬۵۶۷ تومان"
 * formatPersianNumber(1234567, false) // "۱٬۲۳۴٬۵۶۷"
 */
export const formatPersianNumber = (value: number, showCurrency: boolean = true): string => {
  if (!value && value !== 0) return '';
  
  const formatted = formatNumberWithCommas(value);
  const persianFormatted = englishToPersianDigits(formatted);
  
  return showCurrency ? `${persianFormatted} تومان` : persianFormatted;
};

/**
 * React hook for managing formatted number input
 * @param initialValue - Initial numeric value
 * @returns Object with formatted value, raw value, and handlers
 */
export const useFormattedNumber = (initialValue: number = 0) => {
  const [rawValue, setRawValue] = useState<number>(initialValue);
  const [formattedValue, setFormattedValue] = useState<string>(formatNumberWithCommas(initialValue));

  const updateValue = (newValue: string | number) => {
    const numericValue = typeof newValue === 'string' ? parseFormattedNumber(newValue) : newValue;
    const formatted = formatNumberWithCommas(numericValue);
    
    setRawValue(numericValue);
    setFormattedValue(formatted);
  };

  const reset = () => {
    setRawValue(0);
    setFormattedValue('');
  };

  return {
    rawValue,
    formattedValue,
    updateValue,
    reset,
  };
};

// Import useState for the hook
import { useState } from 'react';
