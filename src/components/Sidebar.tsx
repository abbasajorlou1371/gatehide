'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpen }: SidebarProps) {
  // Mock authentication state - replace with actual auth logic
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFinancialOpen, setIsFinancialOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Minimum distance for swipe detection
  const minSwipeDistance = 50;

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end and detect swipe
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    // const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe right to close sidebar (when open)
    if (isRightSwipe && isOpen) {
      onClose();
    }
    
    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Add global touch event listeners for swipe detection
  useEffect(() => {
    if (!isClient) return;

    const handleGlobalTouchStart = (e: TouchEvent) => {
      // Handle edge swipes when sidebar is closed
      if (!isOpen && e.touches[0].clientX > window.innerWidth - 30) {
        setTouchStart(e.touches[0].clientX);
        setTouchEnd(null);
      }
      // Handle swipes when sidebar is open (for closing)
      else if (isOpen) {
        setTouchStart(e.touches[0].clientX);
        setTouchEnd(null);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (touchStart !== null) {
        setTouchEnd(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (!isOpen) {
        // Swipe from right edge to open sidebar
        if (isLeftSwipe && touchStart > window.innerWidth - 50 && onOpen) {
          onOpen();
        }
      } else {
        // Swipe right to close sidebar from anywhere on screen
        if (isRightSwipe) {
          onClose();
        }
      }
      
      setTouchStart(null);
      setTouchEnd(null);
    };

    // Add event listeners
    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isClient, isOpen, touchStart, touchEnd, onOpen, onClose]);

  const menuItems: Array<{
    name: string;
    href?: string;
    icon: string;
    hasDropdown?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
    children?: Array<{ name: string; href: string; icon: string }>;
  }> = [
    { name: 'داشبورد', href: '/', icon: '📊' },
    { name: 'گیم نت‌ها', href: '/gamenets', icon: '🎮' },
    { name: 'رزرو دستگاه‌ها', href: '/reservation', icon: '💻' },
    { name: 'کاربران', href: '/users', icon: '👥' },
    { name: 'پلن‌های اشتراک', href: '/subscription-plans', icon: '📋' },
    { name: 'آمار و تحلیل‌ها', href: '/analytics', icon: '📈' },
    { 
      name: 'امور مالی', 
      icon: '💰', 
      hasDropdown: true,
      isOpen: isFinancialOpen,
      onToggle: () => setIsFinancialOpen(!isFinancialOpen),
      children: [
        { name: 'کیف پول', href: '/wallet', icon: '💎' },
        { name: 'پرداخت‌ها', href: '/payments', icon: '💳' },
        { name: 'تراکنش‌ها', href: '/transactions', icon: '📈' },
        { name: 'فاکتورها', href: '/invoices', icon: '📄' },
      ]
    },
    { name: 'تنظیمات', href: '/settings', icon: '⚙️' },
    { name: 'پشتیبانی', href: '/support', icon: '💬' },
  ];

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Add actual login logic here
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Add actual logout logic here
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const isFinancialActive = () => {
    return pathname.startsWith('/wallet') || pathname.startsWith('/payments') || pathname.startsWith('/transactions') || pathname.startsWith('/invoices');
  };

  return (
    <>
      {/* Swipe indicator when sidebar is closed */}
      {!isOpen && (
        <div className="fixed top-1/2 right-0 z-40 w-2 h-16 bg-gradient-to-l from-purple-500/30 to-transparent rounded-l-lg lg:hidden transform -translate-y-1/2" />
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black bg-opacity-80 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-[60] h-full w-64 gx-glass shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header with Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-600">
            <Link href="/" className="sm:block text-xl font-bold gx-gradient-text">
              🎮 GateHide
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              aria-label="بستن منو"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation (scrollable) */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-thin">
            {menuItems.map((item) => {
              if (item.hasDropdown) {
                const isActive = isFinancialActive();
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={item.onToggle}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors menu-wave relative ${
                        isActive
                          ? 'menu-item-active text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className={`me-3 text-lg icon-wave ${isActive ? 'animate-pulse' : ''}`}>
                        {item.icon}
                      </span>
                      <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                      <div className="mr-auto flex items-center gap-2">
                        {isActive && (
                          <div className="w-2 h-2 bg-purple-400 rounded-full active-indicator"></div>
                        )}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            item.isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {/* Dropdown Items */}
                    {item.isOpen && (
                      <div className="mr-8 space-y-1">
                        {item.children?.map((child) => {
                          const isChildActive = isActiveRoute(child.href);
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                                isChildActive
                                  ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-400'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                              onClick={() => {
                                // Close mobile sidebar when navigating
                                if (isClient && window.innerWidth < 1024) {
                                  onClose();
                                }
                              }}
                            >
                              <span className="me-3 text-sm">{child.icon}</span>
                              <span className={isChildActive ? 'font-medium' : ''}>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
                const isActive = isActiveRoute(item.href || '');
                return (
                  <Link
                    key={item.name}
                    href={item.href || '#'}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors menu-wave relative ${
                      isActive
                        ? 'menu-item-active text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => {
                      // Close mobile sidebar when navigating
                      if (isClient && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <span className={`me-3 text-lg icon-wave ${isActive ? 'animate-pulse' : ''}`}>
                      {item.icon}
                    </span>
                    <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                    <div className="mr-auto flex items-center gap-2">
                      {isActive && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full active-indicator"></div>
                      )}
                    </div>
                  </Link>
                );
              }
            })}
          </nav>

          {/* Sidebar Footer (fixed to bottom) */}
          <div className="border-t border-gray-600 p-4 sticky bottom-0 gx-glass">
            {!isAuthenticated ? (
              <Button 
                onClick={handleLogin}
                variant="primary"
                fullWidth
                size="md"
                className="btn-wave"
              >
                ورود
              </Button>
            ) : (
              <Button 
                onClick={handleLogout}
                variant="outline"
                fullWidth
                size="md"
                className="btn-wave"
              >
                خروج
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
