import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PermissionUtils } from '../utils/permissions';

/**
 * Hook to get all user permissions
 * @returns Array of user permissions
 */
export function usePermissions(): string[] {
  const { permissions } = useAuth();
  return permissions;
}

/**
 * Hook to check if user has a specific permission
 * @param permission Permission string to check
 * @returns True if user has the permission
 */
export function useHasPermission(permission: string): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.checkPermission(permissions, permission);
  }, [permissions, permission]);
}

/**
 * Hook to check if user has any of the required permissions
 * @param requiredPermissions Array of permissions to check
 * @returns True if user has at least one of the permissions
 */
export function useHasAnyPermission(requiredPermissions: string[]): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.checkAnyPermission(permissions, requiredPermissions);
  }, [permissions, requiredPermissions]);
}

/**
 * Hook to check if user has all of the required permissions
 * @param requiredPermissions Array of permissions to check
 * @returns True if user has all permissions
 */
export function useHasAllPermissions(requiredPermissions: string[]): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.checkAllPermissions(permissions, requiredPermissions);
  }, [permissions, requiredPermissions]);
}

/**
 * Hook to check if user can access a specific resource with a specific action
 * @param resource Resource name
 * @param action Action name
 * @returns True if user can access the resource
 */
export function useCanAccessResource(resource: string, action: string): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.checkResourceAccess(permissions, resource, action);
  }, [permissions, resource, action]);
}

/**
 * Hook to check if user has wildcard permission for a pattern
 * @param pattern Permission pattern (e.g., "users:*")
 * @returns True if user has wildcard permission
 */
export function useHasWildcardPermission(pattern: string): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.checkWildcardPermission(permissions, pattern);
  }, [permissions, pattern]);
}

/**
 * Hook to get all permissions for a specific resource
 * @param resource Resource name
 * @returns Array of permissions for the resource
 */
export function useResourcePermissions(resource: string): string[] {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.getResourcePermissions(permissions, resource);
  }, [permissions, resource]);
}

/**
 * Hook to check if user has any permission for a specific resource
 * @param resource Resource name
 * @returns True if user has any permission for the resource
 */
export function useHasResourceAccess(resource: string): boolean {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.hasResourceAccess(permissions, resource);
  }, [permissions, resource]);
}

/**
 * Hook to get all accessible resources
 * @returns Array of unique resource names user has access to
 */
export function useAccessibleResources(): string[] {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.getAccessibleResources(permissions);
  }, [permissions]);
}

/**
 * Hook for permission-based filtering
 * @param items Array of items to filter
 * @param getPermission Function to extract permission from each item
 * @returns Filtered array of items user has permission for
 */
export function useFilterByPermissions<T>(
  items: T[],
  getPermission: (item: T) => string
): T[] {
  const { permissions } = useAuth();
  
  return useMemo(() => {
    return PermissionUtils.filterByPermissions(items, getPermission, permissions);
  }, [items, getPermission, permissions]);
}

/**
 * Hook for permission guard with automatic redirect
 * @param permission Required permission
 * @param redirectTo Redirect path if permission is missing (default: '/forbidden')
 * @returns Object with hasPermission and redirect function
 */
export function usePermissionGuard(permission: string, redirectTo: string = '/forbidden') {
  const hasPermission = useHasPermission(permission);
  
  const redirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `${redirectTo}?permission=${encodeURIComponent(permission)}`;
    }
  };
  
  return {
    hasPermission,
    redirect,
  };
}

/**
 * Hook for multiple permission guard with automatic redirect
 * @param requiredPermissions Required permissions (any or all)
 * @param requireAll Whether to require all permissions (default: false - any)
 * @param redirectTo Redirect path if permission is missing (default: '/forbidden')
 * @returns Object with hasPermission and redirect function
 */
export function useMultiplePermissionGuard(
  requiredPermissions: string[],
  requireAll: boolean = false,
  redirectTo: string = '/forbidden'
) {
  const { permissions } = useAuth();
  
  const hasPermission = useMemo(() => {
    if (requireAll) {
      return PermissionUtils.checkAllPermissions(permissions, requiredPermissions);
    } else {
      return PermissionUtils.checkAnyPermission(permissions, requiredPermissions);
    }
  }, [permissions, requiredPermissions, requireAll]);
  
  const redirect = () => {
    if (typeof window !== 'undefined') {
      const permissionParam = requiredPermissions.join(',');
      window.location.href = `${redirectTo}?permissions=${encodeURIComponent(permissionParam)}`;
    }
  };
  
  return {
    hasPermission,
    redirect,
  };
}

/**
 * Hook to get permission summary for debugging
 * @returns Object with permission information
 */
export function usePermissionSummary() {
  const { permissions, userType, isAuthenticated } = useAuth();
  
  return useMemo(() => {
    const grouped = PermissionUtils.groupPermissionsByResource(permissions);
    const resources = PermissionUtils.getAccessibleResources(permissions);
    
    return {
      permissions,
      grouped,
      resources,
      userType,
      isAuthenticated,
      totalPermissions: permissions.length,
      totalResources: resources.length,
    };
  }, [permissions, userType, isAuthenticated]);
}
