export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold gx-gradient-text">در حال بارگذاری...</h2>
          <p className="text-gray-400 text-sm">لطفاً صبر کنید</p>
        </div>
        
        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
