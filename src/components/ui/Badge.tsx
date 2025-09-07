import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-800/50 text-gray-300 border border-gray-600',
    primary: 'bg-purple-500/20 text-purple-300 border border-purple-400',
    secondary: 'bg-cyan-500/20 text-cyan-300 border border-cyan-400',
    success: 'bg-green-500/20 text-green-300 border border-green-400',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400',
    danger: 'bg-red-500/20 text-red-300 border border-red-400'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <span className={classes} dir="rtl">
      {children}
    </span>
  );
}
