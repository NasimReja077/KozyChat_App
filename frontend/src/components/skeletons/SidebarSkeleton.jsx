//src/components/skeletons/SidebarSkeleton.jsx
import React from 'react';
const SidebarSkeleton = () => {
  const skeletons = Array(6).fill(null);
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 bg-[#0F172A]">
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="p-4 border-b border-[#1a1e2e] rounded-lg shadow-sm bg-[#0F172A] animate-pulse"
        >
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="relative w-14 h-14">
              <div className="w-full h-full bg-gray-700 rounded-full" />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-gray-600 rounded-full border-2 border-[#0a0d17]" />
            </div>

            {/* Texts Skeleton */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-gray-600 rounded" />
                <div className="h-3 w-10 bg-gray-700 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div className="h-3 w-32 bg-gray-700 rounded" />
                <div className="h-5 w-6 bg-blue-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarSkeleton;