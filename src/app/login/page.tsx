'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Badge, Card } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface LoginFormData {
  email: string;
  password: string;
  twoFactorCode: string;
}

type LoginMethod = 'email' | 'qr' | '2fa';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    twoFactorCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Generate mock QR code data
  useEffect(() => {
    if (loginMethod === 'qr') {
      // Mock QR code data - in real app, this would come from backend
      setQrCodeData('gatehide://login?token=mock-qr-token-12345&expires=2024-12-31');
    }
  }, [loginMethod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'لطفاً ایمیل و رمز عبور را وارد کنید',
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - check if 2FA is enabled
      const mockUser = {
        email: formData.email,
        has2FA: formData.email.includes('2fa') || formData.email === 'admin@gatehide.com'
      };

      if (mockUser.has2FA) {
        setIs2FAEnabled(true);
        setLoginMethod('2fa');
        
        await Swal.fire({
          title: 'احراز هویت دو مرحله‌ای 🔐',
          text: 'کد تأیید به ایمیل شما ارسال شد',
          icon: 'info',
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
      } else {
        // Direct login success
        await Swal.fire({
          title: 'ورود موفق! 🎉',
          text: `خوش آمدید ${formData.email}`,
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
        
        // Redirect to dashboard (in real app)
        // router.push('/');
      }
    } catch (error) {
      await Swal.fire({
        title: 'خطا در ورود! ❌',
        text: 'ایمیل یا رمز عبور اشتباه است',
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

  const handle2FALogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.twoFactorCode) {
      await Swal.fire({
        title: 'خطا! ⚠️',
        text: 'لطفاً کد تأیید را وارد کنید',
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock 2FA validation
      if (formData.twoFactorCode === '123456' || formData.twoFactorCode === '000000') {
        await Swal.fire({
          title: 'ورود موفق! 🎉',
          text: 'احراز هویت دو مرحله‌ای تأیید شد',
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
        
        // Reset form and redirect
        setFormData({ email: '', password: '', twoFactorCode: '' });
        setIs2FAEnabled(false);
        setLoginMethod('email');
        
        // Redirect to dashboard (in real app)
        // router.push('/');
      } else {
        throw new Error('Invalid 2FA code');
      }
    } catch (error) {
      await Swal.fire({
        title: 'کد تأیید اشتباه! ❌',
        text: 'لطفاً کد صحیح را وارد کنید',
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

  const handleQRLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulate QR code scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await Swal.fire({
        title: 'ورود موفق! 🎉',
        text: 'احراز هویت با QR کد انجام شد',
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
      
      // Redirect to dashboard (in real app)
      // router.push('/');
    } catch (error) {
      await Swal.fire({
        title: 'خطا در QR کد! ❌',
        text: 'QR کد نامعتبر یا منقضی شده است',
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

  const resetLoginMethod = () => {
    setLoginMethod('email');
    setIs2FAEnabled(false);
    setFormData({ email: '', password: '', twoFactorCode: '' });
  };

  return (
    <ContentArea className="min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold gx-gradient-text mb-2">GateHide</h1>
          <p className="text-gray-400">ورود به پنل مدیریت</p>
        </div>

        {/* Login Method Selector */}
        {!is2FAEnabled && (
          <Card className="mb-6">
            <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📧 ایمیل
              </button>
              <button
                onClick={() => setLoginMethod('qr')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'qr'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📱 QR کد
              </button>
            </div>
          </Card>
        )}

        {/* Email/Password Login */}
        {loginMethod === 'email' && !is2FAEnabled && (
          <Card>
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div>
                <Input
                  label="ایمیل"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ایمیل خود را وارد کنید"
                  required
                  fullWidth
                />
              </div>

              <div>
                <Input
                  label="رمز عبور"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="رمز عبور خود را وارد کنید"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="mr-2 text-sm text-gray-300">مرا به خاطر بسپار</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="btn-wave"
              >
                {isLoading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2 text-sm">💡 اطلاعات تست:</h4>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• برای فعال کردن 2FA: admin@gatehide.com</p>
                <p>• کد 2FA تست: 123456 یا 000000</p>
                <p>• هر ایمیل دیگری: ورود مستقیم</p>
              </div>
            </div>
          </Card>
        )}

        {/* 2FA Login */}
        {loginMethod === '2fa' && is2FAEnabled && (
          <Card>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-xl font-semibold text-white mb-2">احراز هویت دو مرحله‌ای</h2>
              <p className="text-gray-400 text-sm">
                کد تأیید ارسال شده به ایمیل خود را وارد کنید
              </p>
            </div>

            <form onSubmit={handle2FALogin} className="space-y-6">
              <div>
                <Input
                  label="کد تأیید"
                  name="twoFactorCode"
                  type="text"
                  value={formData.twoFactorCode}
                  onChange={handleInputChange}
                  placeholder="کد 6 رقمی را وارد کنید"
                  maxLength={6}
                  required
                  fullWidth
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={resetLoginMethod}
                >
                  بازگشت
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className="btn-wave"
                >
                  {isLoading ? 'در حال تأیید...' : 'تأیید'}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                ارسال مجدد کد
              </button>
            </div>
          </Card>
        )}

        {/* QR Code Login */}
        {loginMethod === 'qr' && !is2FAEnabled && (
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-xl font-semibold text-white mb-2">ورود با QR کد</h2>
              <p className="text-gray-400 text-sm mb-6">
                QR کد زیر را با اپلیکیشن موبایل خود اسکن کنید
              </p>

              {/* Mock QR Code */}
              <div className="bg-white p-4 rounded-lg inline-block mb-6">
                <div className="w-48 h-48 bg-gray-900 flex items-center justify-center rounded">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-xs">QR Code</div>
                    <div className="text-xs mt-1 font-mono">{qrCodeData}</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleQRLogin}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                className="btn-wave mb-4"
              >
                {isLoading ? 'در حال اسکن...' : 'شبیه‌سازی اسکن QR کد'}
              </Button>

              <div className="text-xs text-gray-500">
                <p>💡 برای تست: روی دکمه بالا کلیک کنید</p>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
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
