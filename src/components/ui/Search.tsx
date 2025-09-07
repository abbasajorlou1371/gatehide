import React from 'react';

interface SearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
}

export default function Search({
  placeholder = "جستجو...",
  value,
  onChange,
  className = "",
  fullWidth = false,
  size = 'md',
  disabled = false,
  onClear,
  showClearButton = true
}: SearchProps) {
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const clearButtonSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className={`${iconSizeClasses[size]} text-gray-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Clear Button */}
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <svg
            className={`${clearButtonSizeClasses[size]}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          block w-full rounded-lg border border-gray-600 bg-gray-800/50 text-white placeholder-gray-400
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${sizeClasses[size]}
          ${value && showClearButton ? 'pl-10' : 'pl-3'}
          pr-10
        `}
      />
    </div>
  );
}
