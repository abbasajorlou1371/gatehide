import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  icon = "🎮" 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-3xl font-bold gx-gradient-text mb-2">{title}</h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 GateHide. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  );
}
