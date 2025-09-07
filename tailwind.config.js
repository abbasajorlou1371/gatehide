/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'persian': ['Vazir', 'Tahoma', 'Arial', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // RTL support using Tailwind CSS v4 built-in logical properties
    function({ addUtilities }) {
      const newUtilities = {
        // Logical margin utilities (start/end instead of left/right)
        '.ms-0': { 'margin-inline-start': '0' },
        '.ms-1': { 'margin-inline-start': '0.25rem' },
        '.ms-2': { 'margin-inline-start': '0.5rem' },
        '.ms-3': { 'margin-inline-start': '0.75rem' },
        '.ms-4': { 'margin-inline-start': '1rem' },
        '.ms-6': { 'margin-inline-start': '1.5rem' },
        '.ms-8': { 'margin-inline-start': '2rem' },
        '.ms-auto': { 'margin-inline-start': 'auto' },
        
        '.me-0': { 'margin-inline-end': '0' },
        '.me-1': { 'margin-inline-end': '0.25rem' },
        '.me-2': { 'margin-inline-end': '0.5rem' },
        '.me-3': { 'margin-inline-end': '0.75rem' },
        '.me-4': { 'margin-inline-end': '1rem' },
        '.me-6': { 'margin-inline-end': '1.5rem' },
        '.me-8': { 'margin-inline-end': '2rem' },
        '.me-auto': { 'margin-inline-end': 'auto' },
        
        // Logical padding utilities
        '.ps-0': { 'padding-inline-start': '0' },
        '.ps-1': { 'padding-inline-start': '0.25rem' },
        '.ps-2': { 'padding-inline-start': '0.5rem' },
        '.ps-3': { 'padding-inline-start': '0.75rem' },
        '.ps-4': { 'padding-inline-start': '1rem' },
        '.ps-6': { 'padding-inline-start': '1.5rem' },
        '.ps-8': { 'padding-inline-start': '2rem' },
        
        '.pe-0': { 'padding-inline-end': '0' },
        '.pe-1': { 'padding-inline-end': '0.25rem' },
        '.pe-2': { 'padding-inline-end': '0.5rem' },
        '.pe-3': { 'padding-inline-end': '0.75rem' },
        '.pe-4': { 'padding-inline-end': '1rem' },
        '.pe-6': { 'padding-inline-end': '1.5rem' },
        '.pe-8': { 'padding-inline-end': '2rem' },
        
        // Logical text alignment
        '.text-start': { 'text-align': 'start' },
        '.text-end': { 'text-align': 'end' },
        
        // Logical spacing utilities
        '.space-s-1': { '--tw-space-s-reverse': '0', 'margin-inline-start': 'calc(0.25rem * var(--tw-space-s-reverse))', 'margin-inline-end': 'calc(0.25rem * calc(1 - var(--tw-space-s-reverse)))' },
        '.space-s-2': { '--tw-space-s-reverse': '0', 'margin-inline-start': 'calc(0.5rem * var(--tw-space-s-reverse))', 'margin-inline-end': 'calc(0.5rem * calc(1 - var(--tw-space-s-reverse)))' },
        '.space-s-3': { '--tw-space-s-reverse': '0', 'margin-inline-start': 'calc(0.75rem * var(--tw-space-s-reverse))', 'margin-inline-end': 'calc(0.75rem * calc(1 - var(--tw-space-s-reverse)))' },
        '.space-s-4': { '--tw-space-s-reverse': '0', 'margin-inline-start': 'calc(1rem * var(--tw-space-s-reverse))', 'margin-inline-end': 'calc(1rem * calc(1 - var(--tw-space-s-reverse)))' },
        
        // Logical positioning
        '.start-0': { 'inset-inline-start': '0' },
        '.end-0': { 'inset-inline-end': '0' },
        '.start-auto': { 'inset-inline-start': 'auto' },
        '.end-auto': { 'inset-inline-end': 'auto' },
        
        // Custom scrollbar styling
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-track-gray-800': {
          'scrollbar-color': '#1f2937 transparent',
        },
        '.scrollbar-thumb-gray-600': {
          'scrollbar-color': '#4b5563 #1f2937',
        },
        '.hover\\:scrollbar-thumb-gray-500:hover': {
          'scrollbar-color': '#6b7280 #1f2937',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}