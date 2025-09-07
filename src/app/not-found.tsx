'use client';

import Link from 'next/link';
import { Card, Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full">
        <Card className="gx-neon text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl font-bold gx-gradient-text mb-4 animate-pulse">
              404
            </div>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              صفحه مورد نظر یافت نشد
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است منتقل شده باشد.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <Button className="btn-primary btn-wave w-full sm:w-auto">
                🏠 بازگشت به صفحه اصلی
              </Button>
            </Link>
            <Link href="/gamenets">
              <Button className="btn-ghost btn-wave w-full sm:w-auto">
                🎮 گیم نت‌ها
              </Button>
            </Link>
            <Link href="/subscriptions">
              <Button className="btn-ghost btn-wave w-full sm:w-auto">
                💳 اشتراک‌ها
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="border-t border-gray-600 pt-6">
            <p className="text-gray-400 text-sm mb-4">
              اگر فکر می‌کنید این یک خطا است، لطفاً با تیم پشتیبانی تماس بگیرید.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-gray-500">📧 support@gatehide.com</span>
              <span className="text-gray-500">📞 021-12345678</span>
            </div>
          </div>
        </Card>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce">
          🎮
        </div>
        <div className="absolute top-20 right-20 text-3xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>
          💻
        </div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>
          🚀
        </div>
        <div className="absolute bottom-10 right-10 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>
          ⚡
        </div>
      </div>
    </div>
  );
}
