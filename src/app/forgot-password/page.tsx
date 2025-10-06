'use client';

import { useState } from 'react';
import { Button, Input, Card } from '../../components/ui';
import AuthLayout from '../../components/AuthLayout';
import Link from 'next/link';

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [email, setEmail] = useState(''); // Keep for display in success message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;

      // Basic validation
      if (!email) {
        setErrors({ email: 'ایمیل الزامی است' });
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: 'فرمت ایمیل صحیح نیست' });
        return;
      }

      // Simulate API call to forgot password endpoint
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('ایمیل یافت نشد');
        } else {
          throw new Error('خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید');
        }
      }

      await response.json();
      setEmail(email); // Store email for success message
      setIsEmailSent(true);
      
    } catch (error) {
      // Capture the error message to display to the user
      const errorMessage = error instanceof Error ? error.message : 'خطا در ارسال ایمیل';
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      // Simulate API call to resend endpoint
      const response = await fetch('/api/auth/resend-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('خطا در ارسال مجدد ایمیل');
      }

      await response.json();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطا در ارسال مجدد ایمیل';
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="فراموشی رمز عبور" 
      subtitle="بازنشانی رمز عبور خود"
      icon="🔑"
    >
      {!isEmailSent ? (
          <Card>
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور برای شما ارسال شود
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="ایمیل"
                  name="email"
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  error={errors.email}
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
                {isLoading ? 'در حال ارسال...' : 'ارسال لینک بازنشانی'}
              </Button>
            </form>
          </Card>
        ) : (
          <Card>
            <div className="text-center">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-xl font-semibold text-white mb-4">ایمیل ارسال شد!</h2>
              
              <div className="space-y-4 text-sm text-gray-300">
                <p>
                  لینک بازنشانی رمز عبور به آدرس زیر ارسال شد:
                </p>
                <p className="font-medium text-purple-400 break-all">
                  {email}
                </p>
                <p>
                  لطفاً صندوق ورودی ایمیل خود را بررسی کنید و روی لینک کلیک کنید.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className="btn-wave"
                >
                  {isLoading ? 'در حال ارسال...' : 'ارسال مجدد ایمیل'}
                </Button>

                <Button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  تغییر ایمیل
                </Button>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-lg">⚠️</span>
                  <div className="text-yellow-300 text-xs">
                    <p className="font-medium mb-1">نکات مهم:</p>
                    <ul className="space-y-1 text-right">
                      <li>• لینک فقط 15 دقیقه معتبر است</li>
                      <li>• اگر ایمیل را دریافت نکردید، پوشه اسپم را بررسی کنید</li>
                      <li>• برای امنیت بیشتر، لینک فقط یک بار قابل استفاده است</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

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
