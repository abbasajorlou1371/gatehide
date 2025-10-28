import { useEffect } from 'react';

/**
 * Hook to dynamically update page title
 */
export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    const baseTitle = 'گیت هاید';
    const fullTitle = title === baseTitle ? title : `${title} - ${baseTitle}`;
    
    // Update document title
    document.title = fullTitle;
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        // Create meta description if it doesn't exist
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = fullTitle;
      document.head.appendChild(meta);
    }
    
    // Update Open Graph description if provided
    if (description) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
    
    // Update Twitter title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', fullTitle);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'twitter:title';
      meta.content = fullTitle;
      document.head.appendChild(meta);
    }
    
    // Update Twitter description if provided
    if (description) {
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);
}

/**
 * Predefined page titles and descriptions
 */
export const PAGE_TITLES = {
  dashboard: {
    title: 'داشبورد',
    description: 'داشبورد مدیریت گیم نت و آمار بازیکنان'
  },
  login: {
    title: 'ورود',
    description: 'ورود به پنل کاربری گیت هاید'
  },
  gamenets: {
    title: 'مدیریت گیم نت‌ها',
    description: 'مدیریت و نظارت بر گیم نت‌های تحت پوشش'
  },
  users: {
    title: 'مدیریت کاربران',
    description: 'مدیریت کاربران و بازیکنان گیم نت'
  },
  analytics: {
    title: 'تحلیل و آمار',
    description: 'تحلیل عملکرد و آمار گیم نت'
  },
  settings: {
    title: 'تنظیمات',
    description: 'تنظیمات حساب کاربری و امنیت'
  },
  wallet: {
    title: 'کیف پول',
    description: 'مدیریت کیف پول و تراکنش‌ها'
  },
  transactions: {
    title: 'تراکنش‌ها',
    description: 'تاریخچه تراکنش‌ها و پرداخت‌ها'
  },
  invoices: {
    title: 'فاکتورها',
    description: 'مدیریت فاکتورها و صورتحساب‌ها'
  },
  payments: {
    title: 'پرداخت‌ها',
    description: 'مدیریت پرداخت‌ها و روش‌های پرداخت'
  },
  subscriptionPlans: {
    title: 'پلن‌های اشتراک',
    description: 'مدیریت پلن‌های اشتراک و قیمت‌گذاری'
  },
  reservation: {
    title: 'رزرو',
    description: 'رزرو میز و مدیریت نوبت‌ها'
  },
  support: {
    title: 'پشتیبانی',
    description: 'تماس با پشتیبانی و راهنمایی'
  },
  forgotPassword: {
    title: 'فراموشی رمز عبور',
    description: 'بازیابی رمز عبور حساب کاربری'
  },
  resetPassword: {
    title: 'بازیابی رمز عبور',
    description: 'تنظیم رمز عبور جدید'
  },
  logout: {
    title: 'خروج',
    description: 'خروج از حساب کاربری'
  },
} as const;
