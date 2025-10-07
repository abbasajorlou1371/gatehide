'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/AuthLayout';
import { Card } from '../../components/ui';

export default function LogoutPage() {
  const [error, setError] = useState<string | null>(null);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        if (isAuthenticated) {
          await logout();
        }
        
        // Redirect to login page after successful logout
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch {
        setError('خطا در خروج از سیستم');
      }
    };

    performLogout();
  }, [logout, isAuthenticated, router]);

  if (error) {
    return (
      <AuthLayout 
        title="خطا در خروج" 
        subtitle="مشکلی در خروج از سیستم رخ داده است"
        icon="⚠️"
      >
        <Card>
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-4">خطا در خروج</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="btn-primary px-6 py-2 rounded-lg"
            >
              بازگشت به صفحه ورود
            </button>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="در حال خروج" 
      subtitle="لطفاً صبر کنید..."
      icon="🚪"
    >
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-4">در حال خروج از سیستم</h2>
          <p className="text-gray-300 mb-6">لطفاً صبر کنید تا از سیستم خارج شوید...</p>
          <div className="flex justify-center space-x-2 space-x-reverse">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    </AuthLayout>
  );
}
