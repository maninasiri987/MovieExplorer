function SkeletonCard() {
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden animate-pulse">
      <div className="relative aspect-[2/3] bg-gray-700">
        {/* Skeleton image placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800"></div>

        {/* Skeleton content overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            {/* Skeleton title */}
            <div className="h-4 sm:h-6 bg-gray-600 rounded-lg w-3/4 mb-2"></div>

            {/* Skeleton details */}
            <div className="flex items-center gap-1 sm:gap-2 mt-1">
              <div className="h-3 sm:h-4 bg-gray-600 rounded w-8"></div>
              <div className="h-3 sm:h-4 bg-gray-600 rounded w-2"></div>
              <div className="h-3 sm:h-4 bg-gray-600 rounded w-12"></div>
              <div className="hidden sm:block h-3 sm:h-4 bg-gray-600 rounded w-2"></div>
              <div className="hidden sm:block h-3 sm:h-4 bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
