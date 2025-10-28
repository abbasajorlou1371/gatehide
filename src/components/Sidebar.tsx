'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PERMISSIONS } from '../types/permission';
import { useHasPermission, useHasAnyPermission } from '../hooks/usePermissions';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpen }: SidebarProps) {
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

  // Permission checks for financial dropdown
  const hasWalletView = useHasPermission(PERMISSIONS.WALLET_VIEW);
  const hasPaymentsView = useHasPermission(PERMISSIONS.PAYMENTS_VIEW);
  const hasTransactionsView = useHasPermission(PERMISSIONS.TRANSACTIONS_VIEW);
  const hasInvoicesView = useHasPermission(PERMISSIONS.INVOICES_VIEW);
  
  // Check if user has any financial permissions to show the dropdown
  const hasAnyFinancialPermission = useHasAnyPermission([
    PERMISSIONS.WALLET_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.INVOICES_VIEW,
  ]);

  const menuItems: Array<{
    name: string;
    href?: string;
    icon: string;
    hasDropdown?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
    children?: Array<{ name: string; href: string; icon: string; permission?: string }>;
    permission?: string;
  }> = [
    { name: 'داشبورد', href: '/', icon: '📊', permission: PERMISSIONS.DASHBOARD_VIEW },
    { name: 'گیم نت‌ها', href: '/gamenets', icon: '🎮', permission: PERMISSIONS.GAMENETS_VIEW },
    { name: 'رزرو دستگاه‌ها', href: '/reservation', icon: '💻', permission: PERMISSIONS.RESERVATION_MANAGE },
    { name: 'کاربران', href: '/users', icon: '👥', permission: PERMISSIONS.USERS_VIEW },
    { name: 'پلن‌های اشتراک', href: '/subscription-plans', icon: '📋', permission: PERMISSIONS.SUBSCRIPTION_PLANS_VIEW },
    { name: 'آمار و تحلیل‌ها', href: '/analytics', icon: '📈', permission: PERMISSIONS.ANALYTICS_VIEW },
    { 
      name: 'امور مالی', 
      icon: '💰', 
      hasDropdown: true,
      isOpen: isFinancialOpen,
      onToggle: () => setIsFinancialOpen(!isFinancialOpen),
      children: [
        { name: 'کیف پول', href: '/wallet', icon: '💎', permission: PERMISSIONS.WALLET_VIEW },
        { name: 'پرداخت‌ها', href: '/payments', icon: '💳', permission: PERMISSIONS.PAYMENTS_VIEW },
        { name: 'تراکنش‌ها', href: '/transactions', icon: '📈', permission: PERMISSIONS.TRANSACTIONS_VIEW },
        { name: 'فاکتورها', href: '/invoices', icon: '📄', permission: PERMISSIONS.INVOICES_VIEW },
      ]
    },
    { name: 'تنظیمات', href: '/settings', icon: '⚙️', permission: PERMISSIONS.SETTINGS_MANAGE },
    { name: 'پشتیبانی', href: '/support', icon: '💬', permission: PERMISSIONS.SUPPORT_ACCESS },
  ];

  // Permission checks for individual menu items
  const hasDashboardView = useHasPermission(PERMISSIONS.DASHBOARD_VIEW);
  const hasGamenetsView = useHasPermission(PERMISSIONS.GAMENETS_VIEW);
  const hasReservationManage = useHasPermission(PERMISSIONS.RESERVATION_MANAGE);
  const hasUsersView = useHasPermission(PERMISSIONS.USERS_VIEW);
  const hasSubscriptionPlansView = useHasPermission(PERMISSIONS.SUBSCRIPTION_PLANS_VIEW);
  const hasAnalyticsView = useHasPermission(PERMISSIONS.ANALYTICS_VIEW);
  const hasSettingsManage = useHasPermission(PERMISSIONS.SETTINGS_MANAGE);
  const hasSupportAccess = useHasPermission(PERMISSIONS.SUPPORT_ACCESS);

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // If item has no permission requirement, show it
    if (!item.permission) {
      return true;
    }
    
    // Check specific permissions
    switch (item.permission) {
      case PERMISSIONS.DASHBOARD_VIEW:
        return hasDashboardView;
      case PERMISSIONS.GAMENETS_VIEW:
        return hasGamenetsView;
      case PERMISSIONS.RESERVATION_MANAGE:
        return hasReservationManage;
      case PERMISSIONS.USERS_VIEW:
        return hasUsersView;
      case PERMISSIONS.SUBSCRIPTION_PLANS_VIEW:
        return hasSubscriptionPlansView;
      case PERMISSIONS.ANALYTICS_VIEW:
        return hasAnalyticsView;
      case PERMISSIONS.SETTINGS_MANAGE:
        return hasSettingsManage;
      case PERMISSIONS.SUPPORT_ACCESS:
        return hasSupportAccess;
      default:
        return true;
    }
  }).map((item) => {
    // Filter children based on permissions if it's a dropdown
    if (item.hasDropdown && item.children) {
      return {
        ...item,
        children: item.children.filter((child) => {
          if (!child.permission) {
            return true;
          }
          
          // Check specific child permissions
          switch (child.permission) {
            case PERMISSIONS.WALLET_VIEW:
              return hasWalletView;
            case PERMISSIONS.PAYMENTS_VIEW:
              return hasPaymentsView;
            case PERMISSIONS.TRANSACTIONS_VIEW:
              return hasTransactionsView;
            case PERMISSIONS.INVOICES_VIEW:
              return hasInvoicesView;
            default:
              return true;
          }
        })
      };
    }
    return item;
  }).filter((item) => {
    // Hide dropdown if it has no visible children
    if (item.hasDropdown && item.children && item.children.length === 0) {
      return false;
    }
    
    // Hide financial dropdown if user has no financial permissions
    if (item.name === 'امور مالی' && !hasAnyFinancialPermission) {
      return false;
    }
    
    return true;
  });

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
            {filteredMenuItems.map((item) => {
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
                        {item.children?.filter(() => {
                          // For now, show all children - permission filtering will be handled by ProtectedRoute
                          return true;
                        }).map((child) => {
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

        </div>
      </div>
    </>
  );
}
