'use client';

import { useState, useEffect } from 'react';
import { Badge, Card } from '../../components/ui';
import ContentArea from '../../components/ContentArea';
import ProtectedRoute from '../../components/ProtectedRoute';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  popularGames: Array<{
    name: string;
    players: number;
    revenue: number;
    icon: string;
  }>;
  userActivity: Array<{
    hour: number;
    users: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    users: number;
  }>;
  topGamenets: Array<{
    name: string;
    revenue: number;
    users: number;
    rating: number;
  }>;
}

function AnalyticsPageContent() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockAnalyticsData: AnalyticsData = {
      totalUsers: 15420,
      activeUsers: 8930,
      totalRevenue: 125000000,
      monthlyGrowth: 18.5,
      popularGames: [
        { name: 'Counter-Strike 2', players: 2450, revenue: 45000000, icon: '🎯' },
        { name: 'Dota 2', players: 1890, revenue: 32000000, icon: '⚔️' },
        { name: 'Valorant', players: 1650, revenue: 28000000, icon: '🔫' },
        { name: 'League of Legends', players: 1420, revenue: 20000000, icon: '🏆' }
      ],
      userActivity: [
        { hour: 0, users: 120 },
        { hour: 2, users: 80 },
        { hour: 4, users: 60 },
        { hour: 6, users: 90 },
        { hour: 8, users: 200 },
        { hour: 10, users: 350 },
        { hour: 12, users: 480 },
        { hour: 14, users: 520 },
        { hour: 16, users: 580 },
        { hour: 18, users: 650 },
        { hour: 20, users: 720 },
        { hour: 22, users: 680 }
      ],
      revenueByMonth: [
        { month: 'فروردین', revenue: 8500000, users: 1200 },
        { month: 'اردیبهشت', revenue: 12000000, users: 1450 },
        { month: 'خرداد', revenue: 15000000, users: 1680 },
        { month: 'تیر', revenue: 18000000, users: 1920 },
        { month: 'مرداد', revenue: 22000000, users: 2100 },
        { month: 'شهریور', revenue: 25000000, users: 2350 }
      ],
      topGamenets: [
        { name: 'گیم نت آریا', revenue: 35000000, users: 1200, rating: 4.8 },
        { name: 'گیم نت پارس', revenue: 28000000, users: 950, rating: 4.6 },
        { name: 'گیم نت هخامنش', revenue: 22000000, users: 780, rating: 4.5 },
        { name: 'گیم نت کوروش', revenue: 18000000, users: 650, rating: 4.4 }
      ]
    };

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getMaxUsers = () => {
    if (!analyticsData || analyticsData.userActivity.length === 0) return 1;
    return Math.max(1, Math.max(...analyticsData.userActivity.map(a => a.users)));
  };

  const getMaxRevenue = () => {
    if (!analyticsData || analyticsData.revenueByMonth.length === 0) return 1;
    return Math.max(1, Math.max(...analyticsData.revenueByMonth.map(r => r.revenue)));
  };

  if (isLoading) {
    return (
      <ContentArea className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </ContentArea>
    );
  }

  if (!analyticsData) {
    return (
      <ContentArea className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-400">خطا در بارگذاری داده‌ها</p>
        </div>
      </ContentArea>
    );
  }

  return (
    <ContentArea className="space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text text-center sm:text-right w-full sm:w-auto">آمار و تحلیل‌ها</h1>
          <p className="text-gray-400 text-sm sm:text-base text-center sm:text-right w-full sm:w-auto">تحلیل جامع عملکرد سیستم و کاربران</p>
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-end w-full sm:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="week">هفته</option>
            <option value="month">ماه</option>
            <option value="year">سال</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Users Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">کل کاربران</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mt-1 sm:mt-2 truncate">
                {analyticsData.totalUsers.toLocaleString()}
              </p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">+{analyticsData.monthlyGrowth}% رشد</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">👥</div>
          </div>
        </Card>

        {/* Active Users Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">کاربران فعال</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mt-1 sm:mt-2 truncate">
                {analyticsData.activeUsers.toLocaleString()}
              </p>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                {Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)}% از کل
              </p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">🟢</div>
          </div>
        </Card>

        {/* Total Revenue Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">کل درآمد</p>
              <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-cyan-400 mt-1 sm:mt-2 truncate">
                {analyticsData.totalRevenue.toLocaleString('fa-IR')} تومان
              </p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">+{analyticsData.monthlyGrowth}% رشد</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">💰</div>
          </div>
        </Card>

        {/* Growth Rate Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">نرخ رشد</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400 mt-1 sm:mt-2 truncate">
                +{analyticsData.monthlyGrowth}%
              </p>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">ماهانه</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">📈</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* User Activity Chart */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-300">فعالیت کاربران در طول روز</h3>
            <Badge variant="primary" size="sm">24 ساعت گذشته</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {analyticsData.userActivity.map((data, index) => (
              <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 text-xs sm:text-sm w-12 sm:w-14 text-right flex-shrink-0">
                  {String(data.hour).padStart(2, '0')}:00
                </span>
                <div className="flex-1 mx-1 sm:mx-2 min-w-0">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, (data.users / getMaxUsers()) * 100))}%`,
                        transitionDelay: `${index * 100}ms`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-blue-400 font-semibold w-10 sm:w-12 text-right text-xs flex-shrink-0">
                  {data.users}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">پیک فعالیت</span>
              <span className="text-green-400 font-semibold">20:00 - 22:00</span>
            </div>
          </div>
        </Card>

        {/* Revenue Growth Chart */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-300">رشد درآمد ماهانه</h3>
            <Badge variant="secondary" size="sm">6 ماه گذشته</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {analyticsData.revenueByMonth.map((data, index) => (
              <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 text-xs sm:text-sm w-14 sm:w-16 text-right flex-shrink-0">{data.month}</span>
                <div className="flex-1 mx-1 sm:mx-2 min-w-0">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, (data.revenue / getMaxRevenue()) * 100))}%`,
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-cyan-400 font-semibold w-10 sm:w-12 text-right text-xs flex-shrink-0">
                  {(data.revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">میانگین رشد ماهانه</span>
              <span className="text-green-400 font-semibold">+{analyticsData.monthlyGrowth}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Popular Games and Top Gamenets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Popular Games */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-300">بازی‌های محبوب</h3>
            <Badge variant="primary" size="sm">این ماه</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {analyticsData.popularGames.map((game, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="text-xl sm:text-2xl flex-shrink-0">{game.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{game.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{game.players} بازیکن</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-green-400 font-semibold text-sm sm:text-base">
                    {(game.revenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-gray-400 text-xs">درآمد</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Gamenets */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-green-300">برترین گیم نت‌ها</h3>
            <Badge variant="success" size="sm">بر اساس درآمد</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {analyticsData.topGamenets.map((gamenet, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="text-xl sm:text-2xl flex-shrink-0">🏆</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{gamenet.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{gamenet.users} کاربر</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-cyan-400 font-semibold text-sm sm:text-base">
                    {(gamenet.revenue / 1000000).toFixed(1)}M
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-gray-400 text-xs">{gamenet.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="gx-neon">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-4 sm:mb-6">معیارهای عملکرد</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-sm text-gray-400">میانگین زمان پاسخ</div>
                <div className="text-lg font-semibold text-green-400">45ms</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="text-sm text-gray-400">نرخ تبدیل</div>
                <div className="text-lg font-semibold text-blue-400">12.5%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <div>
                <div className="text-sm text-gray-400">ارزش متوسط کاربر</div>
                <div className="text-lg font-semibold text-purple-400">8,100 تومان</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="text-sm text-gray-400">رضایت کاربران</div>
                <div className="text-lg font-semibold text-yellow-400">4.7/5</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </ContentArea>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}