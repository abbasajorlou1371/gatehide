'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '../../components/ui';
import AuthLayout from '../../components/AuthLayout';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAuthEndpoint } from '../../config/api';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
  token?: string;
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Set page title
  usePageTitle(PAGE_TITLES.resetPassword.title, PAGE_TITLES.resetPassword.description);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setErrors({ token: 'لینک بازنشانی رمز عبور نامعتبر است' });
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`${getAuthEndpoint('VALIDATE_RESET_TOKEN')}?token=${encodeURIComponent(token)}`);
        
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setErrors({ token: 'لینک بازنشانی رمز عبور نامعتبر یا منقضی شده است' });
        }
      } catch {
        setErrors({ token: 'خطا در بررسی لینک بازنشانی' });
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'رمزهای عبور مطابقت ندارند' });
        return;
      }

      // Validate password strength
      if (formData.newPassword.length < 6) {
        setErrors({ newPassword: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
        return;
      }

      const response = await fetch(getAuthEndpoint('RESET_PASSWORD'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          if (errorData.error === 'Invalid or expired token') {
            setErrors({ token: 'لینک بازنشانی نامعتبر یا منقضی شده است' });
          } else if (errorData.error === 'Passwords do not match') {
            setErrors({ confirmPassword: 'رمزهای عبور مطابقت ندارند' });
          } else if (errorData.error === 'Password must be at least 6 characters long') {
            setErrors({ newPassword: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
          } else {
            setErrors({ newPassword: errorData.error });
          }
        } else {
          throw new Error('خطا در بازنشانی رمز عبور');
        }
        return;
      }

      setIsPasswordReset(true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در بازنشانی رمز عبور';
      setErrors({ newPassword: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (isValidating) {
    return (
      <AuthLayout 
        title="بازنشانی رمز عبور" 
        subtitle="در حال بررسی لینک..."
        icon="🔍"
      >
        <Card>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300">در حال بررسی لینک بازنشانی...</p>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  if (!isValidToken) {
    return (
      <AuthLayout 
        title="خطا در بازنشانی رمز عبور" 
        subtitle="لینک نامعتبر یا منقضی شده"
        icon="❌"
      >
        <Card>
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-4">لینک نامعتبر</h2>
            
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                {errors.token || 'لینک بازنشانی رمز عبور نامعتبر یا منقضی شده است.'}
              </p>
              <p>
                لطفاً دوباره درخواست بازنشانی رمز عبور دهید.
              </p>
            </div>

            <div className="mt-6">
              <Link 
                href="/forgot-password"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                درخواست مجدد بازنشانی رمز عبور
              </Link>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              بازگشت به ورود
            </Link>
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (isPasswordReset) {
    return (
      <AuthLayout 
        title="رمز عبور بازنشانی شد" 
        subtitle="رمز عبور شما با موفقیت تغییر کرد"
        icon="✅"
      >
        <Card>
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-white mb-4">رمز عبور بازنشانی شد!</h2>
            
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                رمز عبور شما با موفقیت تغییر کرد. حالا می‌توانید با رمز عبور جدید وارد شوید.
              </p>
            </div>

            <div className="mt-6">
              <Link 
                href="/login"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                ورود به حساب کاربری
              </Link>
            </div>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="بازنشانی رمز عبور" 
      subtitle="رمز عبور جدید خود را وارد کنید"
      icon="🔑"
    >
      <Card>
        <div className="text-center mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            رمز عبور جدید خود را برای حساب کاربری زیر وارد کنید:
          </p>
          <p className="text-purple-400 font-medium mt-2">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden email input for backend */}
          <input type="hidden" name="email" value={email || ''} />
          <div>
            <Input
              label="رمز عبور جدید"
              name="newPassword"
              type="password"
              placeholder="رمز عبور جدید را وارد کنید"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={errors.newPassword}
              fullWidth
              required
            />
          </div>

          <div>
            <Input
              label="تأیید رمز عبور"
              name="confirmPassword"
              type="password"
              placeholder="رمز عبور را مجدداً وارد کنید"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              fullWidth
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="btn-wave"
          >
            {isLoading ? 'در حال بازنشانی...' : 'بازنشانی رمز عبور'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-400 text-lg">💡</span>
            <div className="text-blue-300 text-xs">
              <p className="font-medium mb-1">نکات امنیتی:</p>
              <ul className="space-y-1 text-right">
                <li>• رمز عبور باید حداقل 6 کاراکتر باشد</li>
                <li>• از ترکیب حروف، اعداد و نمادها استفاده کنید</li>
                <li>• رمز عبور قوی انتخاب کنید</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}