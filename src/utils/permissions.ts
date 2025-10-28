import { ParsedPermission } from '../types/permission';

export class PermissionUtils {
  /**
   * Parse a permission string into resource and action parts
   * @param permission Permission string in format "resource:action"
   * @returns Parsed permission object
   */
  static parsePermission(permission: string): ParsedPermission {
    const parts = permission.split(':');
    if (parts.length !== 2) {
      throw new Error(`Invalid permission format: ${permission}. Expected format: "resource:action"`);
    }
    
    return {
      resource: parts[0],
      action: parts[1],
    };
  }

  /**
   * Check if user has a specific permission
   * @param userPermissions Array of user permissions
   * @param required Required permission string
   * @returns True if user has the permission
   */
  static checkPermission(userPermissions: string[], required: string): boolean {
    return userPermissions.includes(required);
  }

  /**
   * Check if user has any of the required permissions
   * @param userPermissions Array of user permissions
   * @param required Array of required permissions
   * @returns True if user has at least one of the permissions
   */
  static checkAnyPermission(userPermissions: string[], required: string[]): boolean {
    return required.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if user has all of the required permissions
   * @param userPermissions Array of user permissions
   * @param required Array of required permissions
   * @returns True if user has all permissions
   */
  static checkAllPermissions(userPermissions: string[], required: string[]): boolean {
    return required.every(permission => userPermissions.includes(permission));
  }

  /**
   * Check if user can access a specific resource with a specific action
   * @param userPermissions Array of user permissions
   * @param resource Resource name
   * @param action Action name
   * @returns True if user can access the resource
   */
  static checkResourceAccess(userPermissions: string[], resource: string, action: string): boolean {
    const specificPermission = `${resource}:${action}`;
    const wildcardPermission = `${resource}:*`;
    
    return userPermissions.includes(specificPermission) || userPermissions.includes(wildcardPermission);
  }

  /**
   * Check if user has wildcard permission for a pattern
   * @param userPermissions Array of user permissions
   * @param pattern Permission pattern (e.g., "users:*")
   * @returns True if user has wildcard permission
   */
  static checkWildcardPermission(userPermissions: string[], pattern: string): boolean {
    return userPermissions.includes(pattern);
  }

  /**
   * Filter items based on user permissions
   * @param items Array of items to filter
   * @param getPermission Function to extract permission from each item
   * @param userPermissions Array of user permissions
   * @returns Filtered array of items user has permission for
   */
  static filterByPermissions<T>(
    items: T[],
    getPermission: (item: T) => string,
    userPermissions: string[]
  ): T[] {
    return items.filter(item => {
      const permission = getPermission(item);
      return this.checkPermission(userPermissions, permission);
    });
  }

  /**
   * Get all permissions for a specific resource
   * @param userPermissions Array of user permissions
   * @param resource Resource name
   * @returns Array of permissions for the resource
   */
  static getResourcePermissions(userPermissions: string[], resource: string): string[] {
    return userPermissions.filter(permission => {
      const parsed = this.parsePermission(permission);
      return parsed.resource === resource;
    });
  }

  /**
   * Check if user has any permission for a specific resource
   * @param userPermissions Array of user permissions
   * @param resource Resource name
   * @returns True if user has any permission for the resource
   */
  static hasResourceAccess(userPermissions: string[], resource: string): boolean {
    return userPermissions.some(permission => {
      const parsed = this.parsePermission(permission);
      return parsed.resource === resource;
    });
  }

  /**
   * Get all unique resources from user permissions
   * @param userPermissions Array of user permissions
   * @returns Array of unique resource names
   */
  static getAccessibleResources(userPermissions: string[]): string[] {
    const resources = new Set<string>();
    
    userPermissions.forEach(permission => {
      try {
        const parsed = this.parsePermission(permission);
        resources.add(parsed.resource);
      } catch {
        // Skip invalid permissions
      }
    });
    
    return Array.from(resources);
  }

  /**
   * Validate permission string format
   * @param permission Permission string to validate
   * @returns True if permission format is valid
   */
  static isValidPermission(permission: string): boolean {
    try {
      this.parsePermission(permission);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sort permissions by resource and action
   * @param permissions Array of permissions to sort
   * @returns Sorted array of permissions
   */
  static sortPermissions(permissions: string[]): string[] {
    return permissions.sort((a, b) => {
      try {
        const parsedA = this.parsePermission(a);
        const parsedB = this.parsePermission(b);
        
        // First sort by resource
        const resourceCompare = parsedA.resource.localeCompare(parsedB.resource);
        if (resourceCompare !== 0) {
          return resourceCompare;
        }
        
        // Then sort by action
        return parsedA.action.localeCompare(parsedB.action);
      } catch {
        // If parsing fails, keep original order
        return 0;
      }
    });
  }

  /**
   * Group permissions by resource
   * @param permissions Array of permissions
   * @returns Object with resource as key and array of actions as value
   */
  static groupPermissionsByResource(permissions: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    
    permissions.forEach(permission => {
      try {
        const parsed = this.parsePermission(permission);
        if (!grouped[parsed.resource]) {
          grouped[parsed.resource] = [];
        }
        grouped[parsed.resource].push(parsed.action);
      } catch {
        // Skip invalid permissions
      }
    });
    
    return grouped;
  }
}
