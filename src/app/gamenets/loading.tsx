export default function GamenetsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-800/50 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-800/30 rounded w-96 animate-pulse"></div>
        </div>
        
        {/* Search and Stats Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="h-10 bg-gray-800/50 rounded-lg flex-1 max-w-md animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-8 bg-gray-800/50 rounded-full w-20 animate-pulse"></div>
            <div className="h-8 bg-gray-800/50 rounded-full w-20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="gx-glass rounded-xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-800/50 rounded w-32"></div>
                <div className="h-6 w-6 bg-gray-800/50 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-800/30 rounded w-full"></div>
                <div className="h-4 bg-gray-800/30 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800/30 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-gray-800/50 rounded-full w-16"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-800/50 rounded w-16"></div>
                  <div className="h-8 bg-gray-800/50 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
