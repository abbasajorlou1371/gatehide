'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { RedirectUtils } from '../utils/redirect';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'user' | 'admin';
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredUserType,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Store the current path as intended redirect
        RedirectUtils.setIntendedRedirect(pathname);
        router.push(redirectTo || '/login');
        return;
      }

      if (requiredUserType && userType !== requiredUserType) {
        // Redirect to appropriate dashboard based on user type
        const defaultRedirect = userType === 'admin' ? '/admin' : '/';
        router.push(redirectTo || defaultRedirect);
        return;
      }
    }
  }, [isAuthenticated, userType, isLoading, requiredUserType, redirectTo, router, pathname]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (requiredUserType && userType !== requiredUserType) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
