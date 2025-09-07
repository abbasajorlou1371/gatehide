'use client';

import { Button } from './ui';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export default function Header({ onMenuToggle }: HeaderProps) {

  return (
    <header className="gx-glass shadow-md border-b border-gray-600 z-50 flex-shrink-0 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16" dir="rtl">
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

          {/* User Menu */}
          <div className="flex items-center gap-4">
                <Button variant="primary" size="sm" className="btn-wave">
                  ورود
                </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
