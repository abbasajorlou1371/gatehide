'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '../../components/ui';
import AuthLayout from '../../components/AuthLayout';
import { useAuth } from '../../hooks/useAuth';
import { useLoginRedirect } from '../../hooks/useRedirect';
import { ApiError } from '../../utils/api';
import { SecurityUtils } from '../../utils/security';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated, userType, isLoading } = useAuth();
  const { getRedirectUrl } = useLoginRedirect();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectUrl = getRedirectUrl();
      router.push(redirectUrl);
    }
  }, [isAuthenticated, userType, isLoading, router, getRedirectUrl]);

  // Check for login block on mount and update remaining time
  useEffect(() => {
    const checkBlock = () => {
      if (SecurityUtils.isLoginBlocked()) {
        setIsBlocked(true);
        const time = SecurityUtils.getRemainingLockoutTime();
        setRemainingTime(time);
      } else {
        setIsBlocked(false);
        setRemainingTime(0);
      }
    };

    checkBlock();
    
    // Update remaining time every second if blocked
    const interval = setInterval(checkBlock, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors when a new request starts

    // Check if login is blocked
    if (SecurityUtils.isLoginBlocked()) {
      const time = SecurityUtils.getRemainingLockoutTime();
      const minutes = Math.ceil(time / 60000);
      setIsBlocked(true);
      setRemainingTime(time);
      setErrors({
        general: `تعداد تلاش‌های ناموفق زیاد است. لطفاً ${minutes} دقیقه صبر کنید.`
      });
      return;
    }

    try {
      // Basic validation
      if (!email || !password) {
        setErrors({
          email: !email ? 'ایمیل الزامی است' : undefined,
          password: !password ? 'رمز عبور الزامی است' : undefined
        });
        return;
      }

      // Validate email format
      if (!SecurityUtils.isValidEmail(email)) {
        setErrors({ email: 'فرمت ایمیل صحیح نیست' });
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setErrors({ password: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
        return;
      }

      if (password.length > 128) {
        setErrors({ password: 'رمز عبور نباید بیش از 128 کاراکتر باشد' });
        return;
      }

      // Use the auth context login function with remember me
      await login({ email, password }, rememberMe);
      
      // Redirect will be handled by useEffect
      
    } catch (error) {
      // Clear only the password field, keep email
      setPassword('');
      
      // Check if now blocked after failed attempt
      if (SecurityUtils.isLoginBlocked()) {
        const time = SecurityUtils.getRemainingLockoutTime();
        const minutes = Math.ceil(time / 60000);
        setIsBlocked(true);
        setRemainingTime(time);
        setErrors({
          general: `تعداد تلاش‌های ناموفق زیاد است. لطفاً ${minutes} دقیقه صبر کنید.`
        });
        return;
      }
      
      // Handle different types of authentication errors with generic messages
      let errorMessage = 'ایمیل یا رمز عبور اشتباه است';
      
      if (error instanceof ApiError) {
        const errorText = error.error.toLowerCase();
        
        // Only show specific messages for certain errors
        if (errorText.includes('account locked') || errorText.includes('account disabled')) {
          errorMessage = 'حساب کاربری قفل شده است. لطفاً با پشتیبانی تماس بگیرید';
        } else if (errorText.includes('too many attempts') || errorText.includes('rate limit')) {
          errorMessage = 'تعداد تلاش‌های ناموفق زیاد است. لطفاً کمی صبر کنید';
        } else if (errorText.includes('timeout') || errorText.includes('connection')) {
          errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید';
        } else if (error.status >= 500) {
          errorMessage = 'خطا در سرور. لطفاً بعداً تلاش کنید';
        }
        // For 401/404, keep generic "invalid credentials" message
      } else if (error instanceof Error) {
        const errorText = error.message.toLowerCase();
        
        if (errorText.includes('timeout') || errorText.includes('connection')) {
          errorMessage = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید';
        }
      }
      
      // Show error message
      setErrors({
        general: errorMessage
      });
    }
  };

  // Show loading if checking authentication status
  if (isLoading) {
    return (
      <AuthLayout 
        title="GateHide" 
        subtitle="ورود به پنل کاربری"
        icon="🎮"
      >
        <Card>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </Card>
      </AuthLayout>
    );
  }


  // Format remaining time for display
  const formatRemainingTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AuthLayout 
      title="GateHide" 
      subtitle="ورود به پنل کاربری"
      icon="🎮"
    >
      <Card>
        <form onSubmit={handleLogin} className="space-y-6">
              {/* General error message */}
              {errors.general && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  {errors.general}
                  {isBlocked && remainingTime > 0 && (
                    <div className="mt-2 font-mono text-center text-lg">
                      {formatRemainingTime(remainingTime)}
                    </div>
                  )}
                </div>
              )}

              <div>
                <Input
                  label="ایمیل"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  error={errors.email}
                  fullWidth
                  required
                  disabled={isBlocked}
                  autoComplete="email"
                />
              </div>

              <div className="relative">
                <Input
                  label="رمز عبور"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  error={errors.password}
                  fullWidth
                  required
                  disabled={isBlocked}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-9 text-gray-400 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                    disabled={isBlocked}
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
                disabled={isBlocked}
                className="btn-wave"
              >
                {isLoading ? 'در حال ورود...' : isBlocked ? 'ورود مسدود شده' : 'ورود'}
              </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
