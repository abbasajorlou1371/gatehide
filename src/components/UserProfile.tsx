'use client';

import { useAuth } from '../hooks/useAuth';
import { Badge } from './ui';
import LogoutButton from './LogoutButton';

export default function UserProfile() {
  const { user, userType, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 space-x-reverse">
      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm font-medium text-gray-200">
            {user.name}
          </span>
          <Badge 
            variant={userType === 'admin' ? 'danger' : 'primary'}
            size="sm"
          >
            {userType === 'admin' ? 'مدیر' : 'کاربر'}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">
          {user.email}
        </span>
      </div>
      
      {user.image ? (
        <img
          src={user.image}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      
      <LogoutButton size="sm" variant="ghost">
        خروج
      </LogoutButton>
    </div>
  );
}
