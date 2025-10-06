'use client';

import { useState } from 'react';
import { Button, Input, Card } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'لطفاً ایمیل خود را وارد کنید',
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'لطفاً یک ایمیل معتبر وارد کنید',
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

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      
      await Swal.fire({
        title: 'ایمیل ارسال شد! 📧',
        text: 'لینک بازنشانی رمز عبور به ایمیل شما ارسال شد',
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
    } catch {
      await Swal.fire({
        title: 'خطا در ارسال! ❌',
        text: 'خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید',
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

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await Swal.fire({
        title: 'ایمیل مجدد ارسال شد! 📧',
        text: 'لینک جدید به ایمیل شما ارسال شد',
        icon: 'success',
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
    } catch {
      await Swal.fire({
        title: 'خطا در ارسال! ❌',
        text: 'خطا در ارسال مجدد ایمیل',
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

  return (
    <ContentArea className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold gx-gradient-text mb-2">فراموشی رمز عبور</h1>
          <p className="text-gray-400">بازنشانی رمز عبور خود</p>
        </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  required
                  fullWidth
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

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2 text-sm">💡 اطلاعات تست:</h4>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• هر ایمیل معتبری را وارد کنید</p>
                <p>• پس از ارسال، به صفحه تأیید هدایت می‌شوید</p>
                <p>• لینک بازنشانی در ایمیل ارسال می‌شود</p>
              </div>
            </div>
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
        <div className="text-center mt-8 space-y-2">
          <p className="text-gray-500 text-sm">
            رمز عبور خود را به خاطر آوردید؟{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              بازگشت به ورود
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            حساب کاربری ندارید؟{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              ثبت نام کنید
            </button>
          </p>
        </div>
      </div>
    </ContentArea>
  );
}
