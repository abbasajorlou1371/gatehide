import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'danger';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
  primaryAction,
  secondaryAction
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited');
  const [shouldRender, setShouldRender] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationState('entering');
      
      // Start entering animation
      const enteringTimer = setTimeout(() => {
        setAnimationState('entered');
      }, 10); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(enteringTimer);
    } else {
      setAnimationState('exiting');
      
      // Wait for exit animation to complete before unmounting
      const exitingTimer = setTimeout(() => {
        setShouldRender(false);
        setAnimationState('exited');
      }, 300); // Match the transition duration
      
      return () => clearTimeout(exitingTimer);
    }
  }, [isOpen]);

  // Handle focus management and prevent body scroll
  useEffect(() => {
    if (!shouldRender) return;

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldRender]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shouldRender && animationState === 'entered') {
        onClose();
      }
    };

    if (shouldRender) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [shouldRender, animationState, onClose]);

  if (!shouldRender) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className={`fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full bg-black/70 backdrop-blur-md transition-opacity duration-300 z-40 ${
          animationState === 'entering' ? 'opacity-0' : 
          animationState === 'entered' ? 'opacity-100' : 
          animationState === 'exiting' ? 'opacity-0' : 'opacity-0'
        }`}
        onClick={animationState === 'entered' ? onClose : undefined}
        aria-hidden="true"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 40
        }}
      />
      
      {/* Modal container */}
      <div 
        className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-full h-full flex items-center justify-center z-50 p-4"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 50
        }}
      >
        {/* Modal content */}
        <div 
          ref={modalRef}
          className={`gx-glass gx-neon rounded-2xl border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] w-full max-h-[90vh] flex flex-col transform transition-all duration-300 ${
            animationState === 'entering' ? 'scale-95 opacity-0 translate-y-4' : 
            animationState === 'entered' ? 'scale-100 opacity-100 translate-y-0' : 
            animationState === 'exiting' ? 'scale-95 opacity-0 translate-y-4' : 'scale-95 opacity-0 translate-y-4'
          } ${sizeClasses[size]}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          tabIndex={-1}
        >
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-600/30 flex-shrink-0">
              {title && (
                <h2 
                  id="modal-title"
                  className="text-xl leading-6 font-semibold gx-gradient-text"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  aria-label="بستن"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            </div>
          )}
          
          {/* Modal body */}
          <div className="px-6 pt-6 pb-6 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            {children}
          </div>
          
          {/* Modal footer */}
          {(footer || primaryAction || secondaryAction) && (
            <div className="px-6 py-4 border-t border-gray-600/30 flex-shrink-0">
              {footer ? (
                footer
              ) : (
                <div className="flex justify-end gap-2">
                  {secondaryAction && (
                    <button
                      type="button"
                      onClick={secondaryAction.onClick}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-600 rounded-md hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    >
                      {secondaryAction.label}
                    </button>
                  )}
                  {primaryAction && (
                    <button
                      type="button"
                      onClick={primaryAction.onClick}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
                        primaryAction.variant === 'danger'
                          ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                          : 'btn-primary'
                      }`}
                    >
                      {primaryAction.label}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}