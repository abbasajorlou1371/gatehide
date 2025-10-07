'use client';

import { useEffect, useState } from 'react';
import ContentArea from "../components/ContentArea";
import { Card, Badge } from "../components/ui";
import ProtectedRoute from "../components/ProtectedRoute";

function DashboardContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    players: 0,
    revenue: 0,
    servers: 0,
    onlinePlayers: 0
  });

  // Mock data for gamenet management
  const gamenetData = [
    { month: 'فروردین', players: 1200, revenue: 15000000, servers: 8 },
    { month: 'اردیبهشت', players: 1450, revenue: 18000000, servers: 10 },
    { month: 'خرداد', players: 1680, revenue: 22000000, servers: 12 },
    { month: 'تیر', players: 1920, revenue: 25000000, servers: 14 },
    { month: 'مرداد', players: 2100, revenue: 28000000, servers: 16 },
    { month: 'شهریور', players: 2350, revenue: 32000000, servers: 18 },
  ];

  const totalPlayers = 2350;
  const totalRevenue = 32000000;
  const newPlayersThisMonth = 250;
  const revenueGrowth = 12.5;
  const activeServers = 18;
  const serverUptime = 99.8;

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Animate counters
      const animateCounter = (target: number, key: keyof typeof animatedStats, duration: number = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 16);
      };

      animateCounter(totalPlayers, 'players');
      animateCounter(totalRevenue, 'revenue');
      animateCounter(activeServers, 'servers');
      animateCounter(1247, 'onlinePlayers');
    }
  }, [isLoaded, totalPlayers, totalRevenue, activeServers]);

  return (
    <ContentArea className="space-y-6 overflow-hidden">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold gx-gradient-text text-center sm:text-right w-full sm:w-auto">داشبورد گیم نت</h1>
          <p className="text-gray-400 text-sm sm:text-base text-center sm:text-right w-full sm:w-auto">مدیریت شبکه بازی و آمار بازیکنان</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto">
          <Badge variant="success" size="md" className="text-xs sm:text-sm">
            🟢 {activeServers} سرور فعال
          </Badge>
          <Badge variant="primary" size="md" className="text-xs sm:text-sm">
            ⚡ {serverUptime}% آپتایم
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Players Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">کل بازیکنان</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400 mt-1 sm:mt-2 truncate">{animatedStats.players.toLocaleString()}</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">+{newPlayersThisMonth} این ماه</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">🎮</div>
          </div>
        </Card>

        {/* Total Revenue Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">کل درآمد</p>
              <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-cyan-400 mt-1 sm:mt-2 truncate">
                {animatedStats.revenue.toLocaleString('fa-IR')} تومان
              </p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">+{revenueGrowth}% رشد</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">💰</div>
          </div>
        </Card>

        {/* Active Servers Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">سرورهای فعال</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mt-1 sm:mt-2">{animatedStats.servers}</p>
              <p className="text-yellow-400 text-xs sm:text-sm mt-1">{serverUptime}% آپتایم</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">🖥️</div>
          </div>
        </Card>

        {/* Online Players Card */}
        <Card hover className="gx-neon card-wave">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">بازیکنان آنلاین</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mt-1 sm:mt-2 truncate">{animatedStats.onlinePlayers.toLocaleString()}</p>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">53% از کل</p>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl icon-wave flex-shrink-0">👥</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Players Growth Chart */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-purple-300">رشد بازیکنان</h3>
            <Badge variant="primary" size="sm">6 ماه گذشته</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {gamenetData.map((data, index) => (
              <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 text-xs sm:text-sm w-14 sm:w-16 text-right flex-shrink-0">{data.month}</span>
                <div className="flex-1 mx-1 sm:mx-2 min-w-0">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-1000 ease-out chart-bar ${
                        isLoaded ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        width: isLoaded ? `${(data.players / 2500) * 100}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-purple-400 font-semibold w-10 sm:w-12 text-right text-xs flex-shrink-0">
                  {data.players}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">میانگین رشد ماهانه</span>
              <span className="text-green-400 font-semibold">+15.2%</span>
            </div>
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-cyan-300">درآمد ماهانه</h3>
            <Badge variant="secondary" size="sm">6 ماه گذشته</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {gamenetData.map((data, index) => (
              <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 text-xs sm:text-sm w-14 sm:w-16 text-right flex-shrink-0">{data.month}</span>
                <div className="flex-1 mx-1 sm:mx-2 min-w-0">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full transition-all duration-1000 ease-out chart-bar ${
                        isLoaded ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        width: isLoaded ? `${(data.revenue / 35000000) * 100}%` : '0%',
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
              <span className="text-gray-400">میانگین رشد درآمد</span>
              <span className="text-green-400 font-semibold">+{revenueGrowth}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Server Status Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Server Performance */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-300">عملکرد سرورها</h3>
            <Badge variant="success" size="sm">همه آنلاین</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            {gamenetData.map((data, index) => (
              <div key={index} className="flex items-center justify-between gap-2 min-w-0">
                <span className="text-gray-300 text-xs sm:text-sm w-14 sm:w-16 text-right flex-shrink-0">{data.month}</span>
                <div className="flex-1 mx-1 sm:mx-2 min-w-0">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out chart-bar ${
                        isLoaded ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        width: isLoaded ? `${(data.servers / 20) * 100}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-blue-400 font-semibold w-10 sm:w-12 text-right text-xs flex-shrink-0">
                  {data.servers}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">میانگین آپتایم</span>
              <span className="text-green-400 font-semibold">{serverUptime}%</span>
            </div>
          </div>
        </Card>

        {/* Popular Games */}
        <Card className="gx-neon">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-semibold text-green-300">بازی‌های محبوب</h3>
            <Badge variant="primary" size="sm">امروز</Badge>
          </div>
          <div className="space-y-3 sm:space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">🎯</div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base truncate">Counter-Strike 2</p>
                  <p className="text-gray-400 text-xs sm:text-sm">FPS</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-green-400 font-semibold text-sm sm:text-base">456</p>
                <p className="text-gray-400 text-xs">بازیکن</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">⚔️</div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base truncate">Dota 2</p>
                  <p className="text-gray-400 text-xs sm:text-sm">MOBA</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-blue-400 font-semibold text-sm sm:text-base">324</p>
                <p className="text-gray-400 text-xs">بازیکن</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="text-xl sm:text-2xl flex-shrink-0">🏎️</div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm sm:text-base truncate">Racing Games</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Racing</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-purple-400 font-semibold text-sm sm:text-base">198</p>
                <p className="text-gray-400 text-xs">بازیکن</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="gx-neon">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-300 mb-4 sm:mb-6">فعالیت‌های اخیر گیم نت</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-800/50">
            <div className="text-xl sm:text-2xl flex-shrink-0">🎯</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">سرور جدید Counter-Strike 2 راه‌اندازی شد</p>
              <p className="text-gray-400 text-xs sm:text-sm">2 ساعت پیش</p>
            </div>
            <Badge variant="success" size="sm" className="flex-shrink-0">سرور جدید</Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-800/50">
            <div className="text-xl sm:text-2xl flex-shrink-0">👥</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">25 بازیکن جدید ثبت نام کردند</p>
              <p className="text-gray-400 text-xs sm:text-sm">4 ساعت پیش</p>
            </div>
            <Badge variant="primary" size="sm" className="flex-shrink-0">بازیکن جدید</Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-800/50">
            <div className="text-xl sm:text-2xl flex-shrink-0">💰</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">پرداخت 2,500,000 تومان از بازیکن دریافت شد</p>
              <p className="text-gray-400 text-xs sm:text-sm">6 ساعت پیش</p>
            </div>
            <Badge variant="secondary" size="sm" className="flex-shrink-0">درآمد</Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-800/50">
            <div className="text-xl sm:text-2xl flex-shrink-0">🏆</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">تورنمنت Dota 2 با 32 تیم شروع شد</p>
              <p className="text-gray-400 text-xs sm:text-sm">8 ساعت پیش</p>
            </div>
            <Badge variant="warning" size="sm" className="flex-shrink-0">تورنمنت</Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg bg-gray-800/50">
            <div className="text-xl sm:text-2xl flex-shrink-0">🖥️</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm sm:text-base truncate">سرور #3 به‌روزرسانی شد</p>
              <p className="text-gray-400 text-xs sm:text-sm">12 ساعت پیش</p>
            </div>
            <Badge variant="primary" size="sm" className="flex-shrink-0">به‌روزرسانی</Badge>
          </div>
        </div>
      </Card>
    </ContentArea>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
