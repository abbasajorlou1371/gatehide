'use client';

import { useState } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';
import Footer from '../../components/Footer';
import ContentArea from '../../components/ContentArea';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export default function SupportPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      });
    }, 3000);
  };

  const faqData = [
    {
      question: "چگونه می‌توانم در گیم نت ثبت نام کنم؟",
      answer: "برای ثبت نام، روی دکمه 'ثبت نام' در صفحه اصلی کلیک کنید و اطلاعات مورد نیاز را وارد کنید. پس از تأیید ایمیل، می‌توانید از تمام امکانات استفاده کنید."
    },
    {
      question: "چگونه اشتراک خود را تمدید کنم؟",
      answer: "به بخش 'اشتراک‌ها' بروید و روی 'تمدید اشتراک' کلیک کنید. می‌توانید از روش‌های مختلف پرداخت استفاده کنید."
    },
    {
      question: "آیا امکان بازگشت وجه وجود دارد؟",
      answer: "بله، طبق قوانین ما، در صورت عدم رضایت تا 7 روز پس از خرید، امکان بازگشت کامل وجه وجود دارد."
    },
    {
      question: "چگونه می‌توانم رمز عبور خود را تغییر دهم؟",
      answer: "در پنل کاربری، به بخش 'تنظیمات' بروید و روی 'تغییر رمز عبور' کلیک کنید. ایمیل تأیید برای شما ارسال خواهد شد."
    },
    {
      question: "آیا از بازی‌های موبایل پشتیبانی می‌کنید؟",
      answer: "بله، ما از اکثر بازی‌های محبوب موبایل و PC پشتیبانی می‌کنیم. لیست کامل بازی‌ها در بخش 'گیم نت‌ها' موجود است."
    },
    {
      question: "چگونه می‌توانم با تیم پشتیبانی تماس بگیرم؟",
      answer: "می‌توانید از طریق فرم تماس در همین صفحه، ایمیل، تلفن یا چت آنلاین با ما در ارتباط باشید."
    }
  ];

  const supportMethods = [
    {
      icon: "📧",
      title: "ایمیل پشتیبانی",
      description: "پاسخ در کمتر از 24 ساعت",
      contact: "support@gatehide.com",
      action: "ارسال ایمیل"
    },
    {
      icon: "📞",
      title: "تماس تلفنی",
      description: "پاسخ فوری در ساعات کاری",
      contact: "021-12345678",
      action: "تماس بگیرید"
    },
    {
      icon: "💬",
      title: "چت آنلاین",
      description: "پاسخ فوری 24/7",
      contact: "آنلاین",
      action: "شروع چت"
    },
    {
      icon: "📱",
      title: "تلگرام",
      description: "پشتیبانی سریع",
      contact: "@gatehide_support",
      action: "ارسال پیام"
    }
  ];

  return (
    <ContentArea className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gx-gradient-text mb-4">مرکز پشتیبانی</h1>
        <p className="text-gray-400 text-lg">
          ما اینجا هستیم تا به شما کمک کنیم. سوالات خود را بپرسید یا با ما در ارتباط باشید.
        </p>
      </div>

      {/* Support Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportMethods.map((method, index) => (
          <Card key={index} className="gx-neon card-wave text-center">
            <div className="text-4xl mb-4">{method.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{method.description}</p>
            <p className="text-cyan-400 font-medium mb-4">{method.contact}</p>
            <Button className="btn-ghost btn-wave w-full">
              {method.action}
            </Button>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <Card className="gx-neon">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">فرم تماس</h2>
          <Badge variant="primary">پاسخ سریع</Badge>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-semibold text-green-400 mb-2">پیام شما ارسال شد!</h3>
            <p className="text-gray-400">به زودی با شما تماس خواهیم گرفت.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  نام و نام خانوادگی *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="نام خود را وارد کنید"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  ایمیل *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  موضوع *
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="موضوع پیام خود را وارد کنید"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  اولویت
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">کم</option>
                  <option value="medium">متوسط</option>
                  <option value="high">زیاد</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                پیام *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="پیام خود را به تفصیل بنویسید..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn-wave"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    📤 ارسال پیام
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* FAQ Section */}
      <Card className="gx-neon">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">سوالات متداول</h2>
          <Badge variant="secondary">FAQ</Badge>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-gray-600 rounded-lg p-4 hover:bg-gray-800/50 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <span className="text-purple-400 mr-2">❓</span>
                {faq.question}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Resources */}
      <Card className="gx-neon">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">منابع اضافی</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-white mb-2">راهنمای کاربری</h3>
            <p className="text-gray-400 text-sm mb-4">آموزش کامل استفاده از پلتفرم</p>
            <Button className="btn-ghost btn-wave w-full">مطالعه راهنما</Button>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-lg font-semibold text-white mb-2">راهنمای بازی‌ها</h3>
            <p className="text-gray-400 text-sm mb-4">نحوه اتصال و بازی در گیم نت‌ها</p>
            <Button className="btn-ghost btn-wave w-full">مشاهده راهنما</Button>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-white mb-2">تنظیمات سیستم</h3>
            <p className="text-gray-400 text-sm mb-4">بهینه‌سازی برای بهترین عملکرد</p>
            <Button className="btn-ghost btn-wave w-full">راهنمای تنظیمات</Button>
          </div>
        </div>
      </Card>

      <Footer />
    </ContentArea>
  );
}
