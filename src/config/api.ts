// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://api.gatehide.com' 
      : 'http://localhost:8080'),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      LOGOUT: '/api/v1/auth/logout',
      REFRESH: '/api/v1/auth/refresh',
      FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
      RESET_PASSWORD: '/api/v1/auth/reset-password',
      VALIDATE_RESET_TOKEN: '/api/v1/auth/validate-reset-token',
      PROFILE: '/api/v1/profile',
    },
    NOTIFICATIONS: {
      LIST: '/api/v1/notifications',
      GET: '/api/v1/notifications',
    },
    SUBSCRIPTION_PLANS: {
      LIST: '/api/v1/subscription-plans',
      CREATE: '/api/v1/subscription-plans',
      GET: '/api/v1/subscription-plans',
      UPDATE: '/api/v1/subscription-plans',
      DELETE: '/api/v1/subscription-plans',
    },
    HEALTH: '/api/v1/health',
  },
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth endpoints
export const getAuthEndpoint = (endpoint: keyof typeof API_CONFIG.ENDPOINTS.AUTH): string => {
  return buildApiUrl(API_CONFIG.ENDPOINTS.AUTH[endpoint]);
};

// Helper function to get notification endpoints
export const getNotificationEndpoint = (endpoint: keyof typeof API_CONFIG.ENDPOINTS.NOTIFICATIONS): string => {
  return buildApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS[endpoint]);
};

// Helper function to get subscription plan endpoints
export const getSubscriptionPlanEndpoint = (endpoint: keyof typeof API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS): string => {
  return buildApiUrl(API_CONFIG.ENDPOINTS.SUBSCRIPTION_PLANS[endpoint]);
};
