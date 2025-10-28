import { Metadata } from 'next';

/**
 * Generate dynamic page metadata with consistent branding
 */
export function generatePageMetadata(
  pageTitle: string,
  description?: string,
  keywords?: string[]
): Metadata {
  const baseTitle = 'گیت هاید';
  const fullTitle = pageTitle === baseTitle ? pageTitle : `${pageTitle} - ${baseTitle}`;
  
  return {
    title: fullTitle,
    description: description || 'پلتفرم مدیریت گیم نت',
    keywords: keywords || ['گیم نت', 'مدیریت', 'بازی', 'GateHide'],
    openGraph: {
      title: fullTitle,
      description: description || 'پلتفرم مدیریت گیم نت',
      type: 'website',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description: description || 'پلتفرم مدیریت گیم نت',
    },
  };
}

/**
 * Predefined metadata for common pages
 */
export const PAGE_METADATA = {
  dashboard: generatePageMetadata(
    'داشبورد',
    'داشبورد مدیریت گیم نت و آمار بازیکنان',
    ['داشبورد', 'آمار', 'گیم نت', 'مدیریت']
  ),
  login: generatePageMetadata(
    'ورود',
    'ورود به پنل کاربری گیت هاید',
    ['ورود', 'لاگین', 'احراز هویت']
  ),
  gamenets: generatePageMetadata(
    'مدیریت گیم نت‌ها',
    'مدیریت و نظارت بر گیم نت‌های تحت پوشش',
    ['گیم نت', 'مدیریت', 'نظارت']
  ),
  users: generatePageMetadata(
    'مدیریت کاربران',
    'مدیریت کاربران و بازیکنان گیم نت',
    ['کاربران', 'بازیکنان', 'مدیریت']
  ),
  analytics: generatePageMetadata(
    'تحلیل و آمار',
    'تحلیل عملکرد و آمار گیم نت',
    ['تحلیل', 'آمار', 'عملکرد']
  ),
  settings: generatePageMetadata(
    'تنظیمات',
    'تنظیمات حساب کاربری و امنیت',
    ['تنظیمات', 'حساب کاربری', 'امنیت']
  ),
  wallet: generatePageMetadata(
    'کیف پول',
    'مدیریت کیف پول و تراکنش‌ها',
    ['کیف پول', 'تراکنش', 'پرداخت']
  ),
  transactions: generatePageMetadata(
    'تراکنش‌ها',
    'تاریخچه تراکنش‌ها و پرداخت‌ها',
    ['تراکنش', 'پرداخت', 'تاریخچه']
  ),
  invoices: generatePageMetadata(
    'فاکتورها',
    'مدیریت فاکتورها و صورتحساب‌ها',
    ['فاکتور', 'صورتحساب', 'مدیریت']
  ),
  payments: generatePageMetadata(
    'پرداخت‌ها',
    'مدیریت پرداخت‌ها و روش‌های پرداخت',
    ['پرداخت', 'روش پرداخت', 'مدیریت']
  ),
  subscriptionPlans: generatePageMetadata(
    'پلن‌های اشتراک',
    'مدیریت پلن‌های اشتراک و قیمت‌گذاری',
    ['اشتراک', 'پلن', 'قیمت‌گذاری']
  ),
  reservation: generatePageMetadata(
    'رزرو',
    'رزرو میز و مدیریت نوبت‌ها',
    ['رزرو', 'میز', 'نوبت']
  ),
  support: generatePageMetadata(
    'پشتیبانی',
    'تماس با پشتیبانی و راهنمایی',
    ['پشتیبانی', 'راهنمایی', 'تماس']
  ),
  forgotPassword: generatePageMetadata(
    'فراموشی رمز عبور',
    'بازیابی رمز عبور حساب کاربری',
    ['فراموشی رمز', 'بازیابی', 'رمز عبور']
  ),
  resetPassword: generatePageMetadata(
    'بازیابی رمز عبور',
    'تنظیم رمز عبور جدید',
    ['بازیابی رمز', 'رمز جدید', 'تنظیم']
  ),
  logout: generatePageMetadata(
    'خروج',
    'خروج از حساب کاربری',
    ['خروج', 'لاگ اوت']
  ),
} as const;
