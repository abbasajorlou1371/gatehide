'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ProgressBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startProgress = () => {
      setIsLoading(true);
      setProgress(10);

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(progressTimer);
            return 85;
          }
          return prev + Math.random() * 8 + 2;
        });
      }, 120);
    };

    const completeProgress = () => {
      clearInterval(progressTimer);
      setProgress(100);
      
      completeTimer = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 250);
    };

    startProgress();
    const loadTimer = setTimeout(completeProgress, 400);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
      clearTimeout(loadTimer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 transition-all duration-200 ease-out relative overflow-hidden progress-bar-glow"
        style={{
          width: `${progress}%`,
        }}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent progress-bar-shimmer"></div>
        
        {/* Secondary shimmer for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent progress-bar-shimmer" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}
