import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { RedirectUtils } from '../utils/redirect';

/**
 * Hook for handling authentication redirects
 */
export function useRedirect() {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && RedirectUtils.shouldRedirectToLogin(pathname)) {
      // Store the current path as intended redirect
      RedirectUtils.setIntendedRedirect(pathname);
      router.push('/login');
      return;
    }

    // If authenticated and on login page, redirect to intended destination
    if (isAuthenticated && pathname === '/login') {
      const intendedRedirect = RedirectUtils.getIntendedRedirect();
      if (intendedRedirect) {
        router.push(intendedRedirect);
        return;
      }

      // Fallback to default redirect based on user type
      const defaultRedirect = RedirectUtils.getDefaultRedirectForUserType();
      router.push(defaultRedirect);
    }
  }, [isAuthenticated, userType, isLoading, pathname, router]);
}

/**
 * Hook for getting redirect URL after login
 */
export function useLoginRedirect() {
  
  const getRedirectUrl = (defaultUrl?: string): string => {
    // Check for intended redirect first
    const intendedRedirect = RedirectUtils.getIntendedRedirect();
    if (intendedRedirect) {
      return intendedRedirect;
    }

    // Use provided default or user-type specific default
    if (defaultUrl) {
      return defaultUrl;
    }

    return RedirectUtils.getDefaultRedirectForUserType();
  };

  return { getRedirectUrl };
}
