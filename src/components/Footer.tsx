import React from 'react';

export default function Footer() {
  return (
    <footer className="gx-glass border-t border-gray-600 mt-6">
      <div className="px-6 py-6 text-center text-gray-300 text-sm">
        <p>© {new Date().getFullYear()} 🎮 گیت هاید — تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}
