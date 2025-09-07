export default function SubscriptionsLoading() {
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
        
        {/* Table Skeleton */}
        <div className="gx-glass rounded-xl overflow-hidden animate-pulse">
          <div className="p-6">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-4 pb-4 border-b border-gray-600/30">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-800/50 rounded"></div>
              ))}
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-4 py-4 border-b border-gray-600/20">
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-800/30 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
