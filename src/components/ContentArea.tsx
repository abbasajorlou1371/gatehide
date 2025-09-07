'use client';

import { ReactNode } from 'react';

interface ContentAreaProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  overflow?: 'visible' | 'hidden' | 'auto';
}

export default function ContentArea({ 
  children, 
  className = '', 
  padding = 'md',
  maxWidth = 'full',
  overflow = 'visible'
}: ContentAreaProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const overflowClasses = {
    visible: '',
    hidden: 'overflow-hidden',
    auto: 'overflow-auto'
  };

  const combinedClasses = [
    'w-full',
    paddingClasses[padding],
    maxWidthClasses[maxWidth],
    overflowClasses[overflow],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`${combinedClasses} overflow-hidden`}>
      {children}
    </div>
  );
}
