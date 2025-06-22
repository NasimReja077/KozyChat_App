// frontend/src/components/LeftComponent/LeftChatsBar.jsx
import React, { useState } from 'react';
import { MdNotificationsActive } from "react-icons/md";
import SearchBoxInput from './SearchBoxInput';
import LeftAllUsersLists from './LeftAllUsersLists';
import { useChatStore } from '../../store/useChatStore';

function LeftChatsBar() {
  const { users } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate total unread messages from all users
  const unreadMessagesCount = users?.reduce(
    (sum, user) => sum + (user.unreadCount || 0),
    0
  ) || 0;

  // Filter users based on search query
  const filteredUsers = users?.filter(user =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-full sm:w-[30%] bg-[#0F172A] text-[#E8F7FA] border-r border-[#1A1E2E]/50 flex flex-col shadow-lg">
      {/* Header Section */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-wide">
              Messages
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 transition-colors duration-300">
              {unreadMessagesCount} unread {unreadMessagesCount === 1 ? 'message' : 'messages'}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              title="Notifications"
            >
              <MdNotificationsActive className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 hover:text-blue-400" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[10px] flex items-center justify-center text-white shadow-sm animate-bounce">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <SearchBoxInput onSearch={handleSearch} />
      </div>
      <LeftAllUsersLists filteredUsers={filteredUsers} />
    </div>
  );
}

export default LeftChatsBar;