import React, { useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { FaSquarePhone } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import { CgMoreO, CgCloseO } from "react-icons/cg";
import { FiMail, FiMapPin, FiBriefcase } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";

const MessageHeader = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { selectedUser, setSelectedUser, onlineUsers } = useChatStore();

  if (!selectedUser) return null;

  const isOnline = Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id);

  const handleCloseChat = () => {
    setShowProfile(false);
    setSelectedUser(null);
  };

  return (
    <>
      <div className="p-3 sm:p-4 border-b border-[#2A3447] flex items-center justify-between bg-gradient-to-r from-[#0F172A] to-[#1E293B] shadow-lg">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
          <div className="relative">
            <img
              src={selectedUser.avatar?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
              alt={selectedUser.fullName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md transition-transform duration-300 ease-in-out hover:scale-105 ring-2 ring-offset-2 ring-offset-[#0F172A] ring-blue-500 hover:ring-purple-500"
            />
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0F172A] ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-white text-sm sm:text-base tracking-wide">{selectedUser.fullName}</h3>
            <span className={`text-xs sm:text-sm ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Phone Call"
          >
            <FaSquarePhone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-blue-400" />
          </button>
          <button
            className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Video Call"
          >
            <IoIosVideocam className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-blue-400" />
          </button>
          <button
            className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="More Options"
          >
            <CgMoreO className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-blue-400" />
          </button>
          <button
            onClick={handleCloseChat}
            className="p-2 rounded-full transition-all duration-300 ease-in-out hover:bg-red-600/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Close Chat"
          >
            <IoCloseSharp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-white" />
          </button>
        </div>
      </div>

      {showProfile && (
        <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-72 sm:w-80 bg-[#1E293B]/90 backdrop-blur-lg p-6 shadow-xl z-20 rounded-2xl flex flex-col items-center space-y-4 border border-[#374151]/50 transition-all duration-300 ease-in-out">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
            title="Close Profile"
          >
            <CgCloseO className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="relative group">
            <img
              src={selectedUser.avatar?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}
              alt={selectedUser.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500/80 shadow-lg object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/50"
            />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-wide">{selectedUser.fullName}</h3>
            <p className="text-gray-300 text-sm italic line-clamp-2">{selectedUser.bio || "No bio available"}</p>
          </div>

          <div className="w-full space-y-3 text-gray-300 text-sm sm:text-base">
            <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
              <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span className="truncate">{selectedUser.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
              <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
              <span>{selectedUser.location || "Not specified"}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
              <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
              <span>{selectedUser.occupation || "Not specified"}</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-600/50 my-2"></div>
        </div>
      )}
    </>
  );
};

export default MessageHeader;