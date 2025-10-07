'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import ActiveSessionsModal from '../../components/ActiveSessionsModal';
import ChangePasswordModal from './ChangePasswordModal';

export default function SecuritySettings() {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isActiveSessionsModalOpen, setIsActiveSessionsModalOpen] = useState(false);

  return (
    <>
      <Card className="gx-neon">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">امنیت</h2>
          <Badge variant="warning">🛡️ امنیت</Badge>
        </div>

        <div className="space-y-6">
          {/* Change Password Section */}
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="text-white font-medium mb-2">تغییر رمز عبور</h3>
            <p className="text-gray-400 text-sm mb-4">رمز عبور خود را به‌روزرسانی کنید</p>
            <Button 
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="btn-primary btn-wave"
            >
              🔑 تغییر رمز عبور
            </Button>
          </div>

        {/* Two-Factor Authentication Section */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-white font-medium mb-2">احراز هویت دو مرحله‌ای</h3>
          <p className="text-gray-400 text-sm mb-4">امنیت اضافی برای حساب کاربری شما</p>
          <Button className="btn-ghost btn-wave">
            🔐 فعال‌سازی 2FA
          </Button>
        </div>

        {/* Active Sessions Section */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-white font-medium mb-2">جلسات فعال</h3>
          <p className="text-gray-400 text-sm mb-4">مدیریت دستگاه‌های متصل</p>
          <Button 
            onClick={() => setIsActiveSessionsModalOpen(true)}
            className="btn-primary btn-wave"
          >
            📱 مشاهده جلسات
          </Button>
        </div>

        {/* Delete Account Section */}
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h3 className="text-red-400 font-medium mb-2">حذف حساب کاربری</h3>
          <p className="text-gray-400 text-sm mb-4">این عمل غیرقابل بازگشت است</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            🗑️ حذف حساب
          </Button>
        </div>
      </div>
    </Card>

    {/* Change Password Modal */}
    <ChangePasswordModal
      isOpen={isChangePasswordModalOpen}
      onClose={() => setIsChangePasswordModalOpen(false)}
    />

    {/* Active Sessions Modal */}
    <ActiveSessionsModal
      isOpen={isActiveSessionsModalOpen}
      onClose={() => setIsActiveSessionsModalOpen(false)}
    />
  </>
  );
}
