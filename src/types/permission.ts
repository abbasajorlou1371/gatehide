// Permission string format: "resource:action"
export type Permission = string;

// Parsed permission structure
export interface ParsedPermission {
  resource: string;
  action: string;
}

// Permission constants for all resources
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  
  // Users
  USERS_VIEW: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE: 'users:manage',
  
  // Gamenets
  GAMENETS_VIEW: 'gamenets:read',
  GAMENETS_CREATE: 'gamenets:create',
  GAMENETS_UPDATE: 'gamenets:update',
  GAMENETS_DELETE: 'gamenets:delete',
  GAMENETS_MANAGE: 'gamenets:manage',
  
  // Subscription Plans
  SUBSCRIPTION_PLANS_VIEW: 'subscription_plans:read',
  SUBSCRIPTION_PLANS_CREATE: 'subscription_plans:create',
  SUBSCRIPTION_PLANS_UPDATE: 'subscription_plans:update',
  SUBSCRIPTION_PLANS_DELETE: 'subscription_plans:delete',
  SUBSCRIPTION_PLANS_MANAGE: 'subscription_plans:manage',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Wallet
  WALLET_VIEW: 'wallet:view',
  WALLET_MANAGE: 'wallet:manage',
  
  // Payments
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_CREATE: 'payments:create',
  PAYMENTS_MANAGE: 'payments:manage',
  
  // Transactions
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_EXPORT: 'transactions:export',
  
  // Invoices
  INVOICES_VIEW: 'invoices:view',
  INVOICES_CREATE: 'invoices:create',
  INVOICES_UPDATE: 'invoices:update',
  INVOICES_DELETE: 'invoices:delete',
  INVOICES_MANAGE: 'invoices:manage',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_MANAGE: 'settings:manage',
  
  // Support
  SUPPORT_ACCESS: 'support:access',
  SUPPORT_MANAGE: 'support:manage',
  
  // Notifications
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_CREATE: 'notifications:create',
  NOTIFICATIONS_MANAGE: 'notifications:manage',
  
  // Sessions
  SESSIONS_VIEW: 'sessions:view',
  SESSIONS_MANAGE: 'sessions:manage',
  
  // Reservation
  RESERVATION_MANAGE: 'reservation:manage',
} as const;

// Resource-based permission groups
export const PERMISSION_GROUPS = {
  DASHBOARD: [PERMISSIONS.DASHBOARD_VIEW],
  USERS: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_MANAGE,
  ],
  GAMENETS: [
    PERMISSIONS.GAMENETS_VIEW,
    PERMISSIONS.GAMENETS_CREATE,
    PERMISSIONS.GAMENETS_UPDATE,
    PERMISSIONS.GAMENETS_DELETE,
    PERMISSIONS.GAMENETS_MANAGE,
  ],
  SUBSCRIPTION_PLANS: [
    PERMISSIONS.SUBSCRIPTION_PLANS_VIEW,
    PERMISSIONS.SUBSCRIPTION_PLANS_CREATE,
    PERMISSIONS.SUBSCRIPTION_PLANS_UPDATE,
    PERMISSIONS.SUBSCRIPTION_PLANS_DELETE,
    PERMISSIONS.SUBSCRIPTION_PLANS_MANAGE,
  ],
  ANALYTICS: [
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
  ],
  FINANCIAL: [
    PERMISSIONS.WALLET_VIEW,
    PERMISSIONS.WALLET_MANAGE,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_CREATE,
    PERMISSIONS.PAYMENTS_MANAGE,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_EXPORT,
    PERMISSIONS.INVOICES_VIEW,
    PERMISSIONS.INVOICES_CREATE,
    PERMISSIONS.INVOICES_UPDATE,
    PERMISSIONS.INVOICES_DELETE,
    PERMISSIONS.INVOICES_MANAGE,
  ],
  SETTINGS: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  SUPPORT: [
    PERMISSIONS.SUPPORT_ACCESS,
    PERMISSIONS.SUPPORT_MANAGE,
  ],
  NOTIFICATIONS: [
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_CREATE,
    PERMISSIONS.NOTIFICATIONS_MANAGE,
  ],
  SESSIONS: [
    PERMISSIONS.SESSIONS_VIEW,
    PERMISSIONS.SESSIONS_MANAGE,
  ],
} as const;

// Type for permission values
export type PermissionValue = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Type for permission group values
export type PermissionGroupValue = typeof PERMISSION_GROUPS[keyof typeof PERMISSION_GROUPS][number];
