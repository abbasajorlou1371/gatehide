'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '../../components/ui';
import AuthLayout from '../../components/AuthLayout';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface ResetFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState<ResetFormData>({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  // const [token, setToken] = useState('');

  // Check token validity on component mount
  useEffect(() => {
    // Get token from URL params (in real app, this would come from the reset link)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token') || 'demo-token-123';
    // setToken(tokenFromUrl);

    // Simulate token validation
    const validateToken = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock validation - in real app, this would be an API call
        setIsTokenValid(tokenFromUrl === 'demo-token-123' || tokenFromUrl === 'valid-token');
      } catch {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      errors: {
        minLength: !minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumbers: !hasNumbers,
        hasSpecialChar: !hasSpecialChar
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'لطفاً تمام فیلدها را پر کنید',
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'رمز عبور و تأیید رمز عبور یکسان نیستند',
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      await Swal.fire({
        title: 'رمز عبور ضعیف! ⚠️',
        text: 'رمز عبور باید حداقل 8 کاراکتر و شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد',
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await Swal.fire({
        title: 'رمز عبور تغییر کرد! 🎉',
        text: 'رمز عبور شما با موفقیت تغییر یافت',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });

      // Redirect to login page after successful reset
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch {
      await Swal.fire({
        title: 'خطا در تغییر رمز عبور! ❌',
        text: 'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#ffffff',
        customClass: {
          popup: 'swal2-popup-dark',
          title: 'swal2-title-dark',
          htmlContainer: 'swal2-content-dark'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (isTokenValid === null) {
    return (
      <AuthLayout 
        title="در حال بررسی..." 
        subtitle="لطفاً صبر کنید"
        icon="⏳"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بررسی لینک...</p>
        </div>
      </AuthLayout>
    );
  }

  // Invalid token
  if (isTokenValid === false) {
    return (
      <AuthLayout 
        title="لینک نامعتبر" 
        subtitle="لینک بازنشانی رمز عبور نامعتبر یا منقضی شده است"
        icon="❌"
      >
        <Card>
            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">
                لینک بازنشانی رمز عبور ممکن است:
              </p>
              <ul className="text-gray-400 text-sm space-y-2 text-right">
                <li>• منقضی شده باشد (لینک‌ها فقط 15 دقیقه معتبرند)</li>
                <li>• قبلاً استفاده شده باشد</li>
                <li>• نامعتبر باشد</li>
              </ul>
              
              <div className="pt-4 space-y-3">
                <Link href="/forgot-password">
                  <Button variant="primary" size="lg" fullWidth className="btn-wave">
                    درخواست لینک جدید
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" fullWidth>
                    بازگشت به ورود
                  </Button>
                </Link>
              </div>
            </div>
        </Card>
      </AuthLayout>
    );
  }

  // Valid token - show reset form
  return (
    <AuthLayout 
      title="بازنشانی رمز عبور" 
      subtitle="رمز عبور جدید خود را وارد کنید"
      icon="🔐"
    >
      <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="رمز عبور جدید"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="رمز عبور جدید را وارد کنید"
                required
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showPassword ? 'مخفی کردن' : 'نمایش'} رمز عبور
              </button>
            </div>

            <div>
              <Input
                label="تأیید رمز عبور"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="رمز عبور را مجدداً وارد کنید"
                required
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="mt-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showConfirmPassword ? 'مخفی کردن' : 'نمایش'} رمز عبور
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="text-sm font-medium text-gray-300 mb-3">الزامات رمز عبور:</h4>
                <div className="space-y-2 text-xs">
                  <div className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{formData.password.length >= 8 ? '✅' : '❌'}</span>
                    <span>حداقل 8 کاراکتر</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{/[A-Z]/.test(formData.password) ? '✅' : '❌'}</span>
                    <span>حداقل یک حرف بزرگ</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{/[a-z]/.test(formData.password) ? '✅' : '❌'}</span>
                    <span>حداقل یک حرف کوچک</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{/\d/.test(formData.password) ? '✅' : '❌'}</span>
                    <span>حداقل یک عدد</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✅' : '❌'}</span>
                    <span>حداقل یک کاراکتر خاص</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="btn-wave"
            >
              {isLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2 text-sm">💡 اطلاعات تست:</h4>
            <div className="text-blue-300 text-xs space-y-1">
              <p>• برای تست: ?token=demo-token-123 یا ?token=valid-token</p>
              <p>• رمز عبور باید تمام الزامات را داشته باشد</p>
              <p>• پس از تغییر، به صفحه ورود هدایت می‌شوید</p>
            </div>
          </div>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          رمز عبور خود را به خاطر آوردید؟{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
