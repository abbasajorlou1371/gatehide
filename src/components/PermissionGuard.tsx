'use client';

import React, { ReactNode } from 'react';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '../hooks/usePermissions';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  fallback?: ReactNode;
  requireAll?: boolean;
}

/**
 * Component for conditional rendering based on permissions
 * Supports single permission, any permissions, or all permissions checks
 */
export default function PermissionGuard({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  // Single permission check
  const hasSinglePermission = useHasPermission(permission || '');
  
  // Any permissions check
  const hasAnyPermissions = useHasAnyPermission(anyPermissions || []);
  
  // All permissions check
  const hasAllPermissions = useHasAllPermissions(allPermissions || []);
  
  // Determine if user has required permissions
  let hasPermission = false;
  
  if (permission) {
    hasPermission = hasSinglePermission;
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasPermission = hasAnyPermissions;
  } else if (allPermissions && allPermissions.length > 0) {
    hasPermission = hasAllPermissions;
  } else if (anyPermissions && allPermissions && anyPermissions.length > 0 && allPermissions.length > 0) {
    // Both any and all permissions specified
    if (requireAll) {
      hasPermission = hasAnyPermissions && hasAllPermissions;
    } else {
      hasPermission = hasAnyPermissions || hasAllPermissions;
    }
  }
  
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component for permission-based rendering
 * @param WrappedComponent Component to wrap
 * @param permission Required permission
 * @param fallback Fallback component
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission: string,
  fallback?: React.ComponentType
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard permission={permission} fallback={fallback ? React.createElement(fallback) : null}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Higher-order component for multiple permission-based rendering
 * @param WrappedComponent Component to wrap
 * @param permissions Required permissions
 * @param requireAll Whether to require all permissions
 * @param fallback Fallback component
 */
export function withPermissions<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permissions: string[],
  requireAll: boolean = false,
  fallback?: React.ComponentType
) {
  return function PermissionsWrappedComponent(props: P) {
    return (
      <PermissionGuard 
        {...(requireAll ? { allPermissions: permissions } : { anyPermissions: permissions })}
        fallback={fallback ? React.createElement(fallback) : null}
      >
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}
