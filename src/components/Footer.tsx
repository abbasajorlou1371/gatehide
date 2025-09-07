import React from 'react';

export default function Footer() {
  return (
    <footer className="gx-glass border-t border-gray-600 rounded-t-lg">
      <div className="px-6 py-6 text-center text-gray-300 text-sm" dir="rtl">
        <p>© {new Date().getFullYear()} 🎮 گیت هید — تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}
