'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function ForbiddenPage() {
  const searchParams = useSearchParams();
  const { userType, permissions } = useAuth();
  
  const permissionParam = searchParams.get('permission');
  const permissionsParam = searchParams.get('permissions');
  
  const requiredPermissions = permissionParam ? [permissionParam] : 
    (permissionsParam ? permissionsParam.split(',') : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="text-6xl mb-6">🚫</div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          دسترسی محدود
        </h1>
        
        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          متأسفانه شما دسترسی لازم برای مشاهده این صفحه را ندارید.
        </p>
        
        {/* Permission Details */}
        {requiredPermissions.length > 0 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-red-300 font-semibold mb-2">دسترسی‌های مورد نیاز:</h3>
            <div className="space-y-1">
              {requiredPermissions.map((permission: string, index: number) => (
                <div key={index} className="text-red-200 text-sm font-mono">
                  {permission}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* User Info */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2">اطلاعات کاربری شما:</h3>
          <div className="text-blue-200 text-sm">
            <div>نوع کاربر: <span className="font-semibold">{userType}</span></div>
            <div>تعداد دسترسی‌ها: <span className="font-semibold">{permissions.length}</span></div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            بازگشت به داشبورد
          </Link>
          
          <Link
            href="/support"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            تماس با پشتیبانی
          </Link>
        </div>
        
        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
              اطلاعات دیباگ (فقط در حالت توسعه)
            </summary>
            <div className="mt-2 p-3 bg-gray-800/50 rounded text-xs text-gray-300 font-mono">
              <div><strong>User Type:</strong> {userType}</div>
              <div><strong>Permissions:</strong></div>
              <div className="ml-2">
                {permissions.map((permission: string, index: number) => (
                  <div key={index}>• {permission}</div>
                ))}
              </div>
              <div><strong>Required:</strong> {requiredPermissions.join(', ')}</div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}