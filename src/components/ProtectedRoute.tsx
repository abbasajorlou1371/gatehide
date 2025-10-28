'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '../hooks/usePermissions';
import { useRouter, usePathname } from 'next/navigation';
import { RedirectUtils } from '../utils/redirect';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'user' | 'admin' | 'gamenet';
  requiredPermission?: string;
  requiredAnyPermissions?: string[];
  requiredAllPermissions?: string[];
  redirectTo?: string;
  fallback?: ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredUserType,
  requiredPermission,
  requiredAnyPermissions,
  requiredAllPermissions,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Permission checks
  const hasPermission = useHasPermission(requiredPermission || '');
  const hasAnyPermissions = useHasAnyPermission(requiredAnyPermissions || []);
  const hasAllPermissions = useHasAllPermissions(requiredAllPermissions || []);

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

      // Check permissions if user is authenticated
      if (isAuthenticated) {
        let hasRequiredPermissions = true;

        // Check single permission
        if (requiredPermission) {
          hasRequiredPermissions = hasPermission;
        }
        // Check any permissions
        else if (requiredAnyPermissions && requiredAnyPermissions.length > 0) {
          hasRequiredPermissions = hasAnyPermissions;
        }
        // Check all permissions
        else if (requiredAllPermissions && requiredAllPermissions.length > 0) {
          hasRequiredPermissions = hasAllPermissions;
        }

        if (!hasRequiredPermissions) {
          // Redirect to forbidden page with permission info
          const permissionParam = requiredPermission || 
            (requiredAnyPermissions ? requiredAnyPermissions.join(',') : '') ||
            (requiredAllPermissions ? requiredAllPermissions.join(',') : '');
          router.push(`/forbidden?permission=${encodeURIComponent(permissionParam)}`);
          return;
        }
      }
    }
  }, [
    isAuthenticated, 
    userType, 
    isLoading, 
    requiredUserType, 
    requiredPermission,
    requiredAnyPermissions,
    requiredAllPermissions,
    hasPermission,
    hasAnyPermissions,
    hasAllPermissions,
    redirectTo, 
    router, 
    pathname
  ]);

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

  // Check permissions for rendering
  if (isAuthenticated) {
    let hasRequiredPermissions = true;

    if (requiredPermission) {
      hasRequiredPermissions = hasPermission;
    } else if (requiredAnyPermissions && requiredAnyPermissions.length > 0) {
      hasRequiredPermissions = hasAnyPermissions;
    } else if (requiredAllPermissions && requiredAllPermissions.length > 0) {
      hasRequiredPermissions = hasAllPermissions;
    }

    if (!hasRequiredPermissions) {
      return null; // Will redirect
    }
  }

  return <>{children}</>;
}
