// frontend/src/components/LeftComponent/LeftAllUsersLists.jsx
import React, { useEffect } from 'react';
import { useChatStore } from '../../store/useChatStore.js';
import SidebarSkeleton from '../skeletons/SidebarSkeleton.jsx';

const LeftAllUsersLists = ({ filteredUsers }) => {
  const {
    getUsers,
    selectedUser,
    selectUser,
    isUsersLoading,
    onlineUsers,
  } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  if (!filteredUsers || filteredUsers.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 bg-[#0F172A] text-center text-gray-400 flex items-center justify-center">
        <div className="animate-fadeIn">
          <p className="text-sm sm:text-base">No users available to chat with.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 bg-[#0F172A]">
      {filteredUsers.map((user) => {
        const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(user._id);
        const isSelected = selectedUser?._id === user._id;

        return (
          <div
            key={user._id}
            onClick={() => selectUser(user)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') selectUser(user);
            }}
            tabIndex={0}
            className={`p-3 sm:p-4 mb-2 rounded-xl border border-[#1A1E2E]/50 group transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50
              ${isSelected ? 'bg-[#1E293B] shadow-lg border-cyan-500/30' : 'hover:bg-[#1E293B]/80 hover:shadow-md hover:border-cyan-500/20'}`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                <img
                  src={`${user.avatar?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}?t=${new Date().getTime()}`}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover shadow-sm transition-all duration-300 group-hover:ring-2 group-hover:ring-cyan-400 group-focus:ring-2 group-focus:ring-cyan-400"
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F172A] ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm sm:text-base text-white truncate group-hover:text-cyan-300 group-focus:text-cyan-300 transition-colors duration-300">
                    {user.fullName}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 group-hover:text-gray-200 transition-colors duration-300">
                    {user.lastMessageTime
                      ? new Date(user.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No messages"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs sm:text-sm text-gray-400 truncate pr-4 group-hover:text-gray-200 transition-colors duration-300">
                    {user.lastMessage || "Start a conversation..."}
                  </p>
                  {user.unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeftAllUsersLists;