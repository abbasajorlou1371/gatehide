import { User } from '../types/auth';

// Security utilities for handling authentication tokens and sensitive data

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-4 (0 = very weak, 4 = very strong)
}

export class SecurityUtils {
  // Token storage keys
  private static readonly TOKEN_KEY = 'gatehide_token';
  private static readonly USER_KEY = 'gatehide_user';
  private static readonly USER_TYPE_KEY = 'gatehide_user_type';
  private static readonly REMEMBER_ME_KEY = 'gatehide_remember_me';
  
  // Security configuration
  private static readonly PASSWORD_MIN_LENGTH = 6;
  private static readonly PASSWORD_MAX_LENGTH = 128;
  private static readonly COMMON_WEAK_PASSWORDS = [
    '123456',
    'password',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
  ];

  // Check if we're in a browser environment
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // Determine storage type based on remember me preference
  private static getStorage(): Storage | null {
    if (!this.isClient()) return null;
    
    const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    return rememberMe ? localStorage : sessionStorage;
  }

  // Secure storage operations
  static setItem(key: string, value: string, persistent: boolean = false): void {
    if (!this.isClient()) return;
    
    try {
      const storage = persistent ? localStorage : sessionStorage;
      storage.setItem(key, value);
    } catch (error) {
      // Fallback to memory storage in case of quota exceeded
      this.setMemoryItem(key, value);
    }
  }

  static getItem(key: string): string | null {
    if (!this.isClient()) return null;
    
    try {
      // Try sessionStorage first, then localStorage
      return sessionStorage.getItem(key) || localStorage.getItem(key);
    } catch (error) {
      return this.getMemoryItem(key);
    }
  }

  static removeItem(key: string): void {
    if (!this.isClient()) return;
    
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
      this.removeMemoryItem(key);
    } catch (error) {
      console.error('Failed to remove data:', error);
    }
  }

  static clear(): void {
    if (!this.isClient()) return;
    
    try {
      // Only clear auth-related items, not everything
      this.removeToken();
      this.removeUser();
      this.removeUserType();
      this.clearMemory();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Memory fallback storage
  private static memoryStorage = new Map<string, string>();

  private static setMemoryItem(key: string, value: string): void {
    this.memoryStorage.set(key, value);
  }

  private static getMemoryItem(key: string): string | null {
    return this.memoryStorage.get(key) || null;
  }

  private static removeMemoryItem(key: string): void {
    this.memoryStorage.delete(key);
  }

  private static clearMemory(): void {
    this.memoryStorage.clear();
  }

  // Remember me functionality
  static setRememberMe(remember: boolean): void {
    if (!this.isClient()) return;
    
    try {
      if (remember) {
        localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(this.REMEMBER_ME_KEY);
      }
    } catch (error) {
      console.error('Failed to set remember me preference:', error);
    }
  }

  static getRememberMe(): boolean {
    if (!this.isClient()) return false;
    
    try {
      return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  // Token management
  static setToken(token: string, rememberMe: boolean = false): void {
    this.setItem(this.TOKEN_KEY, token, rememberMe);
    this.setRememberMe(rememberMe);
  }

  static getToken(): string | null {
    return this.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    this.removeItem(this.TOKEN_KEY);
  }

  // User data management
  static setUser(user: User, rememberMe: boolean = false): void {
    this.setItem(this.USER_KEY, JSON.stringify(user), rememberMe);
  }

  static getUser(): User | null {
    const userData = this.getItem(this.USER_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  }

  static removeUser(): void {
    this.removeItem(this.USER_KEY);
  }

  // User type management
  static setUserType(userType: 'user' | 'admin', rememberMe: boolean = false): void {
    this.setItem(this.USER_TYPE_KEY, userType, rememberMe);
  }

  static getUserType(): 'user' | 'admin' | null {
    return this.getItem(this.USER_TYPE_KEY) as 'user' | 'admin' | null;
  }

  static removeUserType(): void {
    this.removeItem(this.USER_TYPE_KEY);
  }

  // Clear all authentication data
  static clearAuth(): void {
    this.removeToken();
    this.removeUser();
    this.removeUserType();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const userType = this.getUserType();
    
    return !!(token && user && userType && !this.isTokenExpired(token));
  }

  // Validate token format (basic validation)
  static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    if (!this.isValidTokenFormat(token)) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false; // No expiration, assume valid
      
      const currentTime = Math.floor(Date.now() / 1000);
      // Add 30 second buffer
      return payload.exp <= currentTime + 30;
    } catch (error) {
      return true;
    }
  }

  // Get token expiration time
  static getTokenExpiration(token: string): Date | null {
    if (!this.isValidTokenFormat(token)) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return null;
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  // Check if token is expiring soon (within 5 minutes)
  static isTokenExpiringSoon(token: string, warningTimeMs: number = 5 * 60 * 1000): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return false;
    
    const now = Date.now();
    const timeUntilExpiration = expiration.getTime() - now;
    
    return timeUntilExpiration > 0 && timeUntilExpiration <= warningTimeMs;
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .trim();
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;
    
    if (password.length < this.PASSWORD_MIN_LENGTH) {
      errors.push(`رمز عبور باید حداقل ${this.PASSWORD_MIN_LENGTH} کاراکتر باشد`);
    } else {
      score += 1;
    }
    
    if (password.length > this.PASSWORD_MAX_LENGTH) {
      errors.push(`رمز عبور نباید بیش از ${this.PASSWORD_MAX_LENGTH} کاراکتر باشد`);
    }
    
    // Check for common weak passwords
    if (this.COMMON_WEAK_PASSWORDS.includes(password.toLowerCase())) {
      errors.push('رمز عبور انتخاب شده ضعیف است');
    } else {
      score += 1;
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 1;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score += 1;
    }

    // Check for numbers
    if (/\d/.test(password)) {
      score += 1;
    }

    // Check for symbols
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(score, 4),
    };
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    if (!this.isClient()) return '';
    
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    if (!this.isClient()) return '';
    
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate phone number (Iranian format)
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone);
  }

  // Validate name format (Persian and English)
  static isValidName(name: string): boolean {
    const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]+$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 100;
  }

  // Rate limiting for login attempts
  private static readonly LOGIN_ATTEMPTS_KEY = 'gatehide_login_attempts';
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  static recordLoginAttempt(): void {
    if (!this.isClient()) return;
    
    try {
      const attempts = this.getLoginAttempts();
      const newAttempt = {
        timestamp: Date.now(),
      };
      
      attempts.push(newAttempt);
      
      // Clean up old attempts (older than lockout duration)
      const cutoffTime = Date.now() - this.LOCKOUT_DURATION_MS;
      const recentAttempts = attempts.filter(a => a.timestamp > cutoffTime);
      
      sessionStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(recentAttempts));
    } catch (error) {
      console.error('Failed to record login attempt:', error);
    }
  }

  static getLoginAttempts(): Array<{ timestamp: number }> {
    if (!this.isClient()) return [];
    
    try {
      const data = sessionStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      if (!data) return [];
      
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static isLoginBlocked(): boolean {
    if (!this.isClient()) return false;
    
    const attempts = this.getLoginAttempts();
    const cutoffTime = Date.now() - this.LOCKOUT_DURATION_MS;
    const recentAttempts = attempts.filter(a => a.timestamp > cutoffTime);
    
    return recentAttempts.length >= this.MAX_LOGIN_ATTEMPTS;
  }

  static getRemainingLockoutTime(): number {
    if (!this.isLoginBlocked()) return 0;
    
    const attempts = this.getLoginAttempts();
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts.map(a => a.timestamp));
    const unlockTime = oldestAttempt + this.LOCKOUT_DURATION_MS;
    
    return Math.max(0, unlockTime - Date.now());
  }

  static clearLoginAttempts(): void {
    if (!this.isClient()) return;
    
    try {
      sessionStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    } catch (error) {
      console.error('Failed to clear login attempts:', error);
    }
  }
}
