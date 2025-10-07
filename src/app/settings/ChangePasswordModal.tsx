'use client';

import { useState } from 'react';
import { Button, Input } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/api';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { token } = useAuth();
  const [changePasswordForm, setChangePasswordForm] = useState<ChangePasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  const handleChangePassword = async () => {
    if (!token) {
      setChangePasswordError('احراز هویت نامعتبر است');
      return;
    }

    // Validate form
    if (!changePasswordForm.currentPassword || !changePasswordForm.newPassword || !changePasswordForm.confirmPassword) {
      setChangePasswordError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      setChangePasswordError('رمز عبور جدید و تأیید رمز عبور مطابقت ندارند');
      return;
    }

    if (changePasswordForm.newPassword.length < 6) {
      setChangePasswordError('رمز عبور جدید باید حداقل 6 کاراکتر باشد');
      return;
    }

    setIsChangingPassword(true);
    setChangePasswordError(null);

    try {
      await apiClient.changePassword(
        token,
        changePasswordForm.currentPassword,
        changePasswordForm.newPassword,
        changePasswordForm.confirmPassword
      );

      setChangePasswordSuccess(true);
      setChangePasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Close modal after 2 seconds on success
      setTimeout(() => {
        setChangePasswordSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 400) {
        const apiError = error as { status: number; error?: string };
        setChangePasswordError(apiError.error || 'خطا در تغییر رمز عبور');
      } else {
        setChangePasswordError('خطا در تغییر رمز عبور');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setChangePasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setChangePasswordError(null);
    setChangePasswordSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تغییر رمز عبور"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-gray-400 text-sm">
          برای تغییر رمز عبور خود، لطفاً رمز عبور فعلی و رمز عبور جدید را وارد کنید.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              رمز عبور فعلی *
            </label>
            <Input
              type="password"
              value={changePasswordForm.currentPassword}
              onChange={(e) => setChangePasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="رمز عبور فعلی خود را وارد کنید"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              رمز عبور جدید *
            </label>
            <Input
              type="password"
              value={changePasswordForm.newPassword}
              onChange={(e) => setChangePasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="رمز عبور جدید خود را وارد کنید"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              تأیید رمز عبور جدید *
            </label>
            <Input
              type="password"
              value={changePasswordForm.confirmPassword}
              onChange={(e) => setChangePasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="رمز عبور جدید را دوباره وارد کنید"
              className="w-full"
            />
          </div>

          {changePasswordError && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{changePasswordError}</p>
            </div>
          )}

          {changePasswordSuccess && (
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">✅ رمز عبور با موفقیت تغییر یافت</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleClose}
            disabled={isChangingPassword}
            className="btn-ghost btn-wave flex-1"
          >
            انصراف
          </Button>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="btn-primary btn-wave flex-1"
          >
            {isChangingPassword ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                در حال تغییر...
              </>
            ) : (
              '🔑 تغییر رمز عبور'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
