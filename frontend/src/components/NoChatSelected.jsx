// frontend/src/components/NoChatSelected.jsx
import React from 'react';
import { BsWechat } from "react-icons/bs";

function NoChatSelected() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 sm:p-12 md:p-16 bg-[#0a0d17] text-[#e8f7fa]">
      <div className="max-w-md text-center space-y-4 sm:space-y-6">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-green-400 via-blue-500 to-purple-500 shadow-2xl animate-pulse flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-md"></div>
              <BsWechat className="relative z-10 text-white text-2xl sm:text-3xl md:text-4xl animate-bounce-slow" />
            </div>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
            Welcome to <span className="text-blue-400">KozyChat</span>
          </h2>
          <p className="text-[#e8f7fa]/70 text-xs sm:text-sm md:text-base">
            Please select a conversation from the sidebar to start chatting. <br />
            We’re excited to have you here!
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoChatSelected;