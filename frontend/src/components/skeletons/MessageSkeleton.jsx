//src/components/skeletons/MessageSkeleton.jsx
import React from 'react';
const skeletonMessages = Array(10).fill(null);
function MessageSkeleton() {
  // Predefine different widths for variety in message bubble size
  const bubbleWidths = ['w-24', 'w-32', 'w-40', 'w-48', 'w-56', 'w-64'];
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#0a0d17]">
      {skeletonMessages.map((_, idx) => {
        const isSender = idx % 2 === 0;
        const bubbleWidth = bubbleWidths[idx % bubbleWidths.length];

        return (
          <div
            key={idx}
            className={`flex ${isSender ? 'justify-start' : 'justify-end'} items-start`}
          >
            {/* Avatar Skeleton */}
            <div
              className={`w-10 h-10 rounded-full bg-gray-700 animate-pulse ${
                isSender ? 'mr-3' : 'ml-3'
              }`}
            />

            {/* Message Skeleton */}
            <div className="flex flex-col space-y-2">
              <div className="h-3 w-20 bg-gray-700 rounded animate-pulse" />
              <div className={`h-6 ${bubbleWidth} bg-gray-700 rounded animate-pulse`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageSkeleton;