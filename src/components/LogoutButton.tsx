'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui';

interface LogoutButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({
  variant = 'ghost',
  size = 'md',
  className = '',
  children = 'خروج',
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Show success message
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Show error message to user
      alert('خطا در خروج از سیستم. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      loading={isLoggingOut}
      disabled={isLoggingOut}
    >
      {children}
    </Button>
  );
}
