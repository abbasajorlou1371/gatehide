'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginRequest, User } from '../types/auth';
import { SecurityUtils } from '../utils/security';
import { apiClient} from '../utils/api';

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  userType: null,
  isAuthenticated: false,
  isLoading: true,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; userType: 'user' | 'admin' } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { token: string } }
  | { type: 'UPDATE_USER'; payload: { user: User } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        userType: action.payload.userType,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        userType: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'REFRESH_TOKEN':
      return {
        ...state,
        token: action.payload.token,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use SecurityUtils for all storage operations

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load authentication state from storage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = SecurityUtils.getToken();
        const userData = SecurityUtils.getUser();
        const userType = SecurityUtils.getUserType();

        if (token && userData && userType) {
          // Check if token is expired
          if (SecurityUtils.isTokenExpired(token)) {
            if (isDevelopment) console.log('Token expired, clearing auth state');
            SecurityUtils.clearAuth();
            dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
            return;
          }

          // Verify token is still valid by fetching profile
          try {
            const profileResponse = await apiClient.getProfile(token);
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: profileResponse.data,
                token,
                userType,
              },
            });
          } catch (error) {
            // Token is invalid, clear storage
            if (isDevelopment) console.error('Token validation failed:', error);
            SecurityUtils.clearAuth();
            dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
        }
      } catch (error) {
        if (isDevelopment) console.error('Failed to load auth state:', error);
        SecurityUtils.clearAuth();
        dispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
      }
    };

    loadAuthState();
  }, []);

  // Smart token refresh - only when token is expiring soon
  useEffect(() => {
    if (!state.token || !state.isAuthenticated) return;

    // Check token expiration every 5 minutes
    const checkInterval = setInterval(async () => {
      if (!state.token) return;
      
      // Check if token is expiring soon (within 5 minutes)
      if (SecurityUtils.isTokenExpiringSoon(state.token)) {
        if (isDevelopment) console.log('Token expiring soon, refreshing...');
        
        try {
          const rememberMe = SecurityUtils.getRememberMe();
          const response = await apiClient.refreshToken(state.token, rememberMe);
          
          dispatch({
            type: 'REFRESH_TOKEN',
            payload: { token: response.data.token },
          });
          SecurityUtils.setToken(response.data.token, rememberMe);
          
          if (isDevelopment) console.log('Token refreshed successfully');
        } catch (error) {
          if (isDevelopment) console.error('Token refresh failed:', error);
          // If refresh fails, logout user
          dispatch({ type: 'LOGOUT' });
          SecurityUtils.clearAuth();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkInterval);
  }, [state.token, state.isAuthenticated]);

  const login = async (credentials: LoginRequest, rememberMe: boolean = false) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      // Sanitize inputs
      const sanitizedCredentials = {
        email: SecurityUtils.sanitizeInput(credentials.email.trim().toLowerCase()),
        password: credentials.password, // Don't sanitize password as it may contain special chars
      };

      const response = await apiClient.login({ ...sanitizedCredentials, remember_me: rememberMe });
      
      // Store authentication data securely with remember me preference
      SecurityUtils.setToken(response.data.token, rememberMe);
      SecurityUtils.setUser(response.data.user, rememberMe);
      SecurityUtils.setUserType(response.data.user_type, rememberMe);
      
      // Clear login attempts on successful login
      SecurityUtils.clearLoginAttempts();

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
          userType: response.data.user_type,
        },
      });
    } catch (error) {
      if (isDevelopment) console.error('Login failed:', error);
      
      // Record failed login attempt
      SecurityUtils.recordLoginAttempt();
      
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    if (isDevelopment) {
      const startTime = Date.now();
      console.log('Starting logout process...');
      
      try {
        if (state.token) {
          console.log('Sending logout request to server...');
          await apiClient.logout(state.token);
        } else {
          console.log('No token found, skipping server logout');
        }
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Don't throw error - we still want to clear local state
      } finally {
        // Always clear local state and storage
        console.log('Clearing authentication data...');
        SecurityUtils.clearAuth();
        dispatch({ type: 'LOGOUT' });
        
        const duration = Date.now() - startTime;
        console.log(`Logout completed in ${duration}ms`);
      }
    } else {
      // Production: No logging
      try {
        if (state.token) {
          await apiClient.logout(state.token);
        }
      } catch {
        // Silently fail
      } finally {
        SecurityUtils.clearAuth();
        dispatch({ type: 'LOGOUT' });
      }
    }
  };

  const refreshToken = useCallback(async () => {
    if (!state.token) return;

    try {
      const rememberMe = SecurityUtils.getRememberMe();
      const response = await apiClient.refreshToken(state.token, rememberMe);
      
      dispatch({
        type: 'REFRESH_TOKEN',
        payload: { token: response.data.token },
      });
      SecurityUtils.setToken(response.data.token, rememberMe);
    } catch (error) {
      if (isDevelopment) console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
      SecurityUtils.clearAuth();
      throw error;
    }
  }, [state.token]);

  const updateUser = (user: User) => {
    const rememberMe = SecurityUtils.getRememberMe();
    dispatch({ type: 'UPDATE_USER', payload: { user } });
    SecurityUtils.setUser(user, rememberMe);
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredUserType?: 'user' | 'admin'
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, userType, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    if (requiredUserType && userType !== requiredUserType) {
      // Redirect to appropriate dashboard based on user type
      if (typeof window !== 'undefined') {
        window.location.href = userType === 'admin' ? '/admin' : '/';
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
