import { useAuth as useAuthContext } from '../contexts/AuthContext';

export { useAuth } from '../contexts/AuthContext';

// Custom hook for checking if user is admin
export function useIsAdmin() {
  const { userType } = useAuthContext();
  return userType === 'admin';
}

// Custom hook for checking if user is regular user
export function useIsUser() {
  const { userType } = useAuthContext();
  return userType === 'user';
}

// Custom hook for getting user permissions
export function usePermissions() {
  const { userType, isAuthenticated } = useAuthContext();
  
  return {
    isAuthenticated,
    isAdmin: userType === 'admin',
    isUser: userType === 'user',
    canAccessAdmin: userType === 'admin',
    canAccessUser: userType === 'user',
  };
}
