'use client';

import { useLinkStatus } from 'next/link';

interface LoadingIndicatorProps {
  className?: string;
}

export default function LoadingIndicator({ className = '' }: LoadingIndicatorProps) {
  const { pending } = useLinkStatus();
  
  if (!pending) return null;

  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      role="status" 
      aria-label="Loading"
    >
      <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );
}
