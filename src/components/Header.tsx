'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function listener(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}

function UserDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useClickOutside(dropdownRef, () => setOpen(false));

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-gray-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-medium border border-gray-500">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-white text-sm">{user.name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 py-2 animate-fade-in">
          <div className="px-4 py-2 border-b border-gray-700">
            <div className="text-sm font-medium text-white">{user.name}</div>
          </div>
          <Link
            href="/settings"
            className="w-full block text-right px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            تنظیمات
          </Link>
          <Link
            href="/wallet"
            className="w-full block text-right px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            کیف پول
          </Link>
          <button
            className="w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
            onClick={async () => {
              setOpen(false);
              // Handle logout directly without confirmation
              try {
                await logout();
              } catch (error) {
                console.error('Logout failed:', error);
                alert('خطا در خروج از سیستم. لطفاً دوباره تلاش کنید.');
              }
            }}
          >
            خروج
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="gx-glass shadow-md border-b border-gray-600 z-50 flex-shrink-0 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            aria-expanded="false"
          >
            <span className="sr-only">باز کردن منو</span>
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Spacer when menu button hidden */}
          <div className="hidden lg:block" />

          {/* User Menu / Login Button */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
            ) : isAuthenticated ? (
              <UserDropdown />
            ) : (
              <Link href="/login">
                <Button
                  variant="primary"
                  size="sm"
                  className="btn-wave"
                >
                  <span className="ml-1">🔑</span>
                  ورود
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
