'use client';

import { useState } from 'react';
import { Button, Input, Card } from '../../components/ui';
import AuthLayout from '../../components/AuthLayout';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const rememberMe = formData.get('rememberMe') === 'on';

      // Basic validation
      if (!email || !password) {
        setErrors({
          email: !email ? 'ایمیل الزامی است' : undefined,
          password: !password ? 'رمز عبور الزامی است' : undefined
        });
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setErrors({ email: 'فرمت ایمیل صحیح نیست' });
        return;
      }

      if (password.length < 6) {
        setErrors({ password: 'رمز عبور باید حداقل 6 کاراکتر باشد' });
        return;
      }

      // Simulate API call to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('ایمیل یا رمز عبور اشتباه است');
        } else {
          throw new Error('خطا در ورود. لطفاً دوباره تلاش کنید');
        }
      }

      const data = await response.json();
      
      // Success - redirect to dashboard (in real app)
      // router.push('/');
      console.log('Login successful:', data);
      
    } catch (error) {
      // Capture the error message to display to the user
      const errorMessage = error instanceof Error ? error.message : 'خطا در ورود';
      setErrors({
        email: errorMessage,
        password: errorMessage
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthLayout 
      title="GateHide" 
      subtitle="ورود به پنل مدیریت"
      icon="🎮"
    >
      <Card>
        <form onSubmit={handleLogin} className="space-y-6">
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

              <div className="relative">
                <Input
                  label="رمز عبور"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="رمز عبور خود را وارد کنید"
                  error={errors.password}
                  fullWidth
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-9 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
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
      </Card>
    </AuthLayout>
  );
}
