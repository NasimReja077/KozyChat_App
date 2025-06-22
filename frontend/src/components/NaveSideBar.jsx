//src/components/NaveSideBar.jsx

import React, { useState } from 'react';
import { BsWechat } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { GiBugleCall } from "react-icons/gi";
import { MdOutlineWebStories } from "react-icons/md";
import { FiSettings, FiLogOut, FiMail, FiMapPin, FiBriefcase } from "react-icons/fi";
import { CgCloseO } from "react-icons/cg";
import { FaUserEdit } from "react-icons/fa";
import { useAuthStore } from "../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

function NaveSideBar() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    { icon: <BsWechat />, label: 'Chats', link: '#', active: true },
    { icon: <MdOutlineWebStories />, label: 'Stories', link: '#' },
    { icon: <HiUserGroup />, label: 'Groups', link: '#' },
    { icon: <GiBugleCall />, label: 'Broadcast', link: '#' },
  ];

  if (!authUser){
    return null; // Add fallback for when authUser is not available
  }
  return (
    <div className="flex h-screen w-20 flex-col justify-between bg-[#0F172A] text-white shadow-lg border-r border-[#1E293B] p-2">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex h-16 w-full items-center justify-center border-b border-[#1E293B]">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">KC</span>
        </div>

        {/* Menu Items */}
        <ul className="mt-4 space-y-6">
          {menuItems.map((item, index) => (
            <li key={index} className="group relative">
              <a
                href={item.link}
                className="flex flex-col items-center justify-center space-y-1 p-3 text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out rounded-xl hover:scale-110"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section: Settings & Profile */}
      <div className="mb-4 flex flex-col items-center space-y-6 relative">
        {/* Settings Button */}
        <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
          <FiSettings className="w-6 h-6 hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute bottom-16 left-12 bg-gradient-to-br from-[#1E293B] to-[#334155] p-6 rounded-3xl shadow-2xl z-10 transition-all duration-300 ease-in-out transform hover:scale-105 backdrop-blur-md border border-gray-700/50 w-72">
               {/* Settings Header */}
            <h3 className="text-2xl font-bold text-white mb-5 tracking-wide flex items-center justify-center ">Settings</h3>
            {/* Edit Profile Button  */}
            <button 
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-3 text-blue-500 hover:text-blue-400 p-3 hover:bg-blue-500/20 rounded-xl transition-all duration-300 w-full cursor-pointer">
              <FaUserEdit className="text-2xl" />
              <span className="text-white text-lg font-semibold">Edit Profile</span>
            </button>

            {/* Logout Button  */}
            <button onClick={logout} className="flex items-center space-x-3 text-red-500 hover:text-red-400 p-3 hover:bg-red-500/20 rounded-xl transition-all w-full duration-300 mt-2 cursor-pointer">
              <FiLogOut className="text-2xl" />
              <span className="text-white text-lg font-semibold">Logout</span>
            </button>

            {/* Divider  */}
            <div className="w-full h-[1px] bg-gray-600 opacity-50 my-4" />
            {/* Derk Mode Toggle  */}
            <div className="flex items-center justify-between gap-4 bg-[#2C3A4B] p-3 rounded-xl shadow-inner">
              <span className="text-white font-medium text-sm">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-500 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Profile Button */}
        <button className="relative" onClick={() => setShowProfile(!showProfile)}>
          <img
            src={authUser?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"} // Fix: Use authUser.avatar.url
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-blue-400 hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg object-cover cursor-pointer"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F172A]" />
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute bottom-20 left-16 sm:left-20 w-80 sm:w-96 bg-[#1E293B]/90 backdrop-blur-lg p-4 sm:p-6 shadow-xl z-20 rounded-2xl transition-all duration-300 ease-in-out scale-100 hover:scale-105 border border-[#374151]/50 flex flex-col items-center space-y-4">
            {/* Close Button */}
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full cursor-pointer"
              title="Close Profile"
            >
              <CgCloseO className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Profile Image */}
            <div className="relative group">
              <img
                src={`${authUser?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"}?t=${new Date().getTime()}`}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500/80 shadow-lg object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/50 cursor-pointer"
              />
              
            </div>

            {/* User Details */}
            <div className="text-center space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">{authUser?.fullName || "Guest User"}</h3>
              <p className="text-gray-300 text-xs sm:text-sm italic line-clamp-2">{authUser?.bio || '"Code. Create. Conquer."'}</p>
            </div>

            {/* Additional Information */}
            <div className="w-full space-y-3 text-gray-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
                <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                <span className="truncate">{authUser?.email || "guestuser123@example.com"}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
                <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span>{authUser?.location || "San Francisco, USA"}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2A3447]/50 p-3 rounded-lg hover:bg-[#2A3447]/80 transition-colors duration-300">
                <FiBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />
                <span>{authUser?.occupation || "Frontend Developer"}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-600/50 my-2 sm:my-3" />

            {/* Profile Actions */}
            <div className="flex w-full justify-around text-gray-300 text-xs sm:text-sm font-medium">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 cursor-pointer"
              >
                <FaUserEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 cursor-pointer"
              >
                <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NaveSideBar;
