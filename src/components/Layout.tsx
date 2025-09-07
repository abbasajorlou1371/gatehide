'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';
import { ProgressBar } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col" dir="rtl">
      <ProgressBar />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
        
        <div className="flex-1 flex flex-col">
          <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
          
          <main className="flex-1 overflow-auto bg-gray-900">
            <ContentArea padding="none">
              {children}
            </ContentArea>
          </main>
        </div>
      </div>
    </div>
  );
}
