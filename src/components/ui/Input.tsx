import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const widthClass = fullWidth ? 'w-full' : '';
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${widthClass} ${iconPadding} ${className}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`} dir="rtl">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
