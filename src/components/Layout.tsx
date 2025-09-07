'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';
import { ProgressBar } from './ui';
import Footer from './Footer';

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

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <ProgressBar />
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} onOpen={openMenu} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
          
          <main className="flex-1 overflow-auto bg-gray-900 min-w-0 scrollbar-hide">
            <ContentArea padding="none">
              {children}
            </ContentArea>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
