'use client';

import { useState } from 'react';
import { Card, Button, Input, Badge } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  bio: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  gameUpdates: boolean;
  paymentAlerts: boolean;
  promotionalEmails: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowFriendRequests: boolean;
  dataSharing: boolean;
  analyticsTracking: boolean;
}

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'علی',
    lastName: 'احمدی',
    email: 'ali.ahmadi@example.com',
    phone: '09123456789',
    birthDate: '1995-03-15',
    bio: 'علاقه‌مند به بازی‌های استراتژیک و FPS'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    gameUpdates: true,
    paymentAlerts: true,
    promotionalEmails: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'friends',
    showOnlineStatus: true,
    allowFriendRequests: true,
    dataSharing: false,
    analyticsTracking: true
  });

  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'fa',
    fontSize: 'medium',
    animations: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveStatus('success');
    
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'پروفایل', icon: '👤' },
    { id: 'notifications', name: 'اعلان‌ها', icon: '🔔' },
    { id: 'privacy', name: 'حریم خصوصی', icon: '🔒' },
    { id: 'appearance', name: 'ظاهر', icon: '🎨' },
    { id: 'security', name: 'امنیت', icon: '🛡️' }
  ] as const;

  return (
    <ContentArea className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-right">
          <h1 className="text-3xl font-bold gx-gradient-text">تنظیمات</h1>
          <p className="text-gray-400 mt-1">مدیریت حساب کاربری و تنظیمات شخصی</p>
        </div>
        <div className="flex flex-col gap-2 items-center w-full sm:flex-row sm:items-center sm:gap-4 sm:w-auto">
          {saveStatus === 'success' && (
            <Badge variant="success" className="w-full sm:w-auto text-center">✅ ذخیره شد</Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary btn-wave w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                در حال ذخیره...
              </>
            ) : (
              '💾 ذخیره تغییرات'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="gx-neon lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="gx-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">اطلاعات پروفایل</h2>
                <Badge variant="primary">👤 پروفایل</Badge>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      نام *
                    </label>
                    <Input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      نام خانوادگی *
                    </label>
                    <Input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      ایمیل *
                    </label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="ایمیل خود را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      شماره تلفن
                    </label>
                    <Input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="شماره تلفن خود را وارد کنید"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    تاریخ تولد
                  </label>
                  <Input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    بیوگرافی
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    placeholder="درباره خود بنویسید..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card className="gx-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">تنظیمات اعلان‌ها</h2>
                <Badge variant="secondary">🔔 اعلان‌ها</Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">
                          {key === 'emailNotifications' && 'اعلان‌های ایمیل'}
                          {key === 'smsNotifications' && 'اعلان‌های پیامکی'}
                          {key === 'pushNotifications' && 'اعلان‌های فوری'}
                          {key === 'gameUpdates' && 'به‌روزرسانی بازی‌ها'}
                          {key === 'paymentAlerts' && 'هشدارهای پرداخت'}
                          {key === 'promotionalEmails' && 'ایمیل‌های تبلیغاتی'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {key === 'emailNotifications' && 'دریافت اعلان‌ها از طریق ایمیل'}
                          {key === 'smsNotifications' && 'دریافت اعلان‌ها از طریق پیامک'}
                          {key === 'pushNotifications' && 'دریافت اعلان‌های فوری در مرورگر'}
                          {key === 'gameUpdates' && 'اطلاع از به‌روزرسانی‌های بازی‌ها'}
                          {key === 'paymentAlerts' && 'هشدار برای تراکنش‌های مالی'}
                          {key === 'promotionalEmails' && 'دریافت پیشنهادات و تخفیف‌ها'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <Card className="gx-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">حریم خصوصی</h2>
                <Badge variant="warning">🔒 حریم خصوصی</Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    سطح نمایش پروفایل
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'private' | 'friends' }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="public">عمومی</option>
                    <option value="friends">فقط دوستان</option>
                    <option value="private">خصوصی</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">
                          {key === 'showOnlineStatus' && 'نمایش وضعیت آنلاین'}
                          {key === 'allowFriendRequests' && 'اجازه درخواست دوستی'}
                          {key === 'dataSharing' && 'اشتراک‌گذاری داده‌ها'}
                          {key === 'analyticsTracking' && 'ردیابی آمار'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {key === 'showOnlineStatus' && 'نمایش وضعیت آنلاین شما به دیگران'}
                          {key === 'allowFriendRequests' && 'اجازه ارسال درخواست دوستی از دیگران'}
                          {key === 'dataSharing' && 'اشتراک‌گذاری داده‌های ناشناس برای بهبود خدمات'}
                          {key === 'analyticsTracking' && 'ردیابی آمار استفاده برای بهبود تجربه کاربری'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="gx-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">ظاهر و نمایش</h2>
                <Badge variant="primary">🎨 ظاهر</Badge>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    تم
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'dark', name: 'تیره', icon: '🌙' },
                      { id: 'light', name: 'روشن', icon: '☀️' },
                      { id: 'auto', name: 'خودکار', icon: '🔄' }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setAppearance(prev => ({ ...prev, theme: theme.id }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          appearance.theme === theme.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-2xl mb-2">{theme.icon}</div>
                        <div className="text-white font-medium">{theme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    زبان
                  </label>
                  <select
                    value={appearance.language}
                    onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="fa">فارسی</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    اندازه فونت
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'small', name: 'کوچک', size: 'text-sm' },
                      { id: 'medium', name: 'متوسط', size: 'text-base' },
                      { id: 'large', name: 'بزرگ', size: 'text-lg' }
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setAppearance(prev => ({ ...prev, fontSize: size.id }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          appearance.fontSize === size.id
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className={`text-white font-medium ${size.size}`}>
                          نمونه متن
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{size.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">انیمیشن‌ها</h3>
                    <p className="text-gray-400 text-sm">فعال‌سازی انیمیشن‌ها و جلوه‌های بصری</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appearance.animations}
                      onChange={(e) => setAppearance(prev => ({ ...prev, animations: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="gx-neon">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">امنیت</h2>
                <Badge variant="warning">🛡️ امنیت</Badge>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">تغییر رمز عبور</h3>
                  <p className="text-gray-400 text-sm mb-4">رمز عبور خود را به‌روزرسانی کنید</p>
                  <Button className="btn-ghost btn-wave">
                    🔑 تغییر رمز عبور
                  </Button>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">احراز هویت دو مرحله‌ای</h3>
                  <p className="text-gray-400 text-sm mb-4">امنیت اضافی برای حساب کاربری شما</p>
                  <Button className="btn-ghost btn-wave">
                    🔐 فعال‌سازی 2FA
                  </Button>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">جلسات فعال</h3>
                  <p className="text-gray-400 text-sm mb-4">مدیریت دستگاه‌های متصل</p>
                  <Button className="btn-ghost btn-wave">
                    📱 مشاهده جلسات
                  </Button>
                </div>

                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="text-red-400 font-medium mb-2">حذف حساب کاربری</h3>
                  <p className="text-gray-400 text-sm mb-4">این عمل غیرقابل بازگشت است</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    🗑️ حذف حساب
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ContentArea>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
