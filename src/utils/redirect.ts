// Redirect utilities for handling intended destinations

export class RedirectUtils {
  private static readonly INTENDED_REDIRECT_KEY = 'gatehide_intended_redirect';

  /**
   * Store the intended redirect URL
   */
  static setIntendedRedirect(url: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Only store if it's not the login page or logout page
      if (url !== '/login' && url !== '/logout' && !url.startsWith('/login') && !url.startsWith('/logout')) {
        sessionStorage.setItem(this.INTENDED_REDIRECT_KEY, url);
      }
    } catch (error) {
      console.error('Failed to store intended redirect:', error);
    }
  }

  /**
   * Get the intended redirect URL
   */
  static getIntendedRedirect(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return sessionStorage.getItem(this.INTENDED_REDIRECT_KEY);
    } catch (error) {
      console.error('Failed to get intended redirect:', error);
      return null;
    }
  }

  /**
   * Clear the intended redirect URL
   */
  static clearIntendedRedirect(): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(this.INTENDED_REDIRECT_KEY);
    } catch (error) {
      console.error('Failed to clear intended redirect:', error);
    }
  }

  /**
   * Get redirect URL with fallback
   */
  static getRedirectUrl(defaultUrl: string = '/'): string {
    const intended = this.getIntendedRedirect();
    if (intended) {
      this.clearIntendedRedirect();
      return intended;
    }
    return defaultUrl;
  }

  /**
   * Check if user should be redirected to login
   */
  static shouldRedirectToLogin(currentPath: string): boolean {
    // Don't redirect if already on login page or logout page
    if (currentPath === '/login' || currentPath === '/logout') {
      return false;
    }

    // Don't redirect for public pages
    const publicPages = ['/forgot-password', '/reset-password'];
    if (publicPages.includes(currentPath)) {
      return false;
    }

    return true;
  }

  /**
   * Get the appropriate redirect URL based on user type
   */
  static getDefaultRedirectForUserType(userType: 'user' | 'admin'): string {
    // Always redirect to dashboard (/) regardless of user type
    return '/';
  }
}
