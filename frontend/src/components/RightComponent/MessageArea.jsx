import React, { useEffect, useRef, useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { GoFileSubmodule } from "react-icons/go";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { LuCheckCheck } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { IoArrowDown } from "react-icons/io5";
import { FaAngleDown, FaTrash, FaCopy } from "react-icons/fa6"; // Added FaCopy icon
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

function MessageArea() {
  const { messages, selectedUser, typingUsers, deleteMessageForMe, deleteMessageForEveryone } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const messageAreaRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [dropdownMessageId, setDropdownMessageId] = useState(null); // Track which message's dropdown is open

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (!messageAreaRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = messageAreaRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    const messageArea = messageAreaRef.current;
    messageArea?.addEventListener("scroll", handleScroll);
    return () => messageArea?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownload = (url, fileName) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName || "downloaded_file");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Download failed:", error);
        toast.error("Failed to download file");
      });
  };

  const handleCopy = (text) => {
    if (!text) {
      toast.error("No text to copy");
      return;
    }

    // Modern clipboard API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("Message copied to clipboard");
        })
        .catch((error) => {
          console.error("Copy failed:", error);
          toast.error("Failed to copy message");
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast.success("Message copied to clipboard");
      } catch (error) {
        console.error("Copy failed:", error);
        toast.error("Failed to copy message");
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setDropdownMessageId(null); // Close dropdown after copying
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    if (
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    ) {
      return "Today";
    }
    return messageDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const renderMessageContent = (message) => {
    if (!message) return <p className="text-sm text-red-500">Invalid message</p>;

    // Check if message is deleted
    const isDeletedForMe = message.deletedFor?.includes(authUser._id);
    const isDeletedForEveryone = message.deletedForEveryone;

    if (isDeletedForMe || isDeletedForEveryone) {
      return (
        <p className="text-sm italic text-gray-400">This message was deleted</p>
      );
    }

    switch (message.type) {
      case "image":
        return (
          <div className="relative group">
            <img
              src={message.media?.url || "https://via.placeholder.com/150"}
              alt={message.text || "Image"}
              className="rounded-xl max-w-[200px] sm:max-w-[300px] cursor-pointer hover:opacity-90 transition-all duration-300 shadow-md"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
                console.error("Image load failed:", message.media?.url);
              }}
            />
            {message.text && (
              <p className="text-sm mt-2 text-gray-300">{message.text}</p>
            )}
            <button
              onClick={() => handleDownload(message.media.url, message.media.fileName)}
              className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Download Image"
              aria-label="Download Image"
            >
              <IoMdDownload className="w-4 h-4 text-white" />
            </button>
          </div>
        );
      case "file":
        return (
          <div className="flex items-center gap-3 bg-[#1E293B]/90 backdrop-blur-sm p-3 rounded-xl hover:bg-[#252A3E]/90 transition-all duration-300 cursor-pointer group shadow-md">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <GoFileSubmodule className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200 truncate max-w-[150px] sm:max-w-[200px]">
                {message.media?.fileName || "File"}
              </p>
              <p className="text-xs text-gray-400">
                {message.media?.fileSize
                  ? `${(message.media.fileSize / 1024).toFixed(2)} KB`
                  : "Unknown size"}
              </p>
            </div>
            <button
              onClick={() => handleDownload(message.media.url, message.media.fileName)}
              className="p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Download File"
              aria-label="Download File"
            >
              <PiDownloadSimpleBold className="w-4 h-4 text-white" />
            </button>
          </div>
        );
      case "video":
        return (
          <div className="relative group">
            <video
              className="rounded-xl max-w-[200px] sm:max-w-[300px] shadow-md"
              controls
              onError={(e) => console.error("Video load failed:", message.media?.url)}
            >
              <source
                src={message.media?.url || "https://via.placeholder.com/150"}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            {message.text && (
              <p className="text-sm mt-2 text-gray-300">{message.text}</p>
            )}
            <button
              onClick={() => handleDownload(message.media.url, message.media.fileName)}
              className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Download Video"
              aria-label="Download Video"
            >
              <IoMdDownload className="w-4 h-4 text-white" />
            </button>
          </div>
        );
      case "gif":
        return (
          <div className="relative group">
            <img
              src={message.gifUrl || "https://via.placeholder.com/150"}
              alt="GIF"
              className="rounded-xl max-w-[200px] sm:max-w-[300px] shadow-md transition-all duration-300 hover:opacity-90"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
                console.error("GIF load failed:", message.gifUrl);
              }}
            />
            {message.text && (
              <p className="text-sm mt-2 text-gray-300">{message.text}</p>
            )}
          </div>
        );
      case "text":
        return (
          <p className="text-sm sm:text-base leading-relaxed">
            {message.text || "No text content"}
          </p>
        );
      default:
        console.warn("Unknown message type:", message.type);
        return (
          <p className="text-sm text-yellow-500">
            Unsupported message type: {message.type}
          </p>
        );
    }
  };

  const renderMessageStatus = (message) => {
    if (!message.readBy || !message.deliveredTo || !selectedUser) return null;
    const isRead =
      Array.isArray(message.readBy) &&
      message.readBy.some((id) => id.toString() === selectedUser._id.toString());
    const isDelivered =
      Array.isArray(message.deliveredTo) &&
      message.deliveredTo.some((id) => id.toString() === selectedUser._id.toString());

    if (isRead)
      return <LuCheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" title="Read" />;
    if (isDelivered)
      return (
        <LuCheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" title="Delivered" />
      );
    return <FaCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" title="Sent" />;
  };

  const groupedMessages = messages.reduce((acc, message, index) => {
    const messageDate = new Date(message.createdAt).toLocaleDateString();
    const prevMessageDate = messages[index - 1]
      ? new Date(messages[index - 1].createdAt).toLocaleDateString()
      : null;

    if (messageDate !== prevMessageDate) {
      acc.push({ type: "date", date: message.createdAt });
    }
    acc.push({ type: "message", message });
    return acc;
  }, []);

  const typingUsersMap = typingUsers instanceof Map ? typingUsers : new Map();
  const isTyping =
    selectedUser?.conversationId &&
    typingUsersMap.has(selectedUser.conversationId) &&
    typingUsersMap.get(selectedUser.conversationId) !== authUser?._id;

  const toggleDropdown = (messageId) => {
    setDropdownMessageId(dropdownMessageId === messageId ? null : messageId);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown")) {
      setDropdownMessageId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!authUser) {
    return <div className="text-center text-gray-400 animate-fadeIn">Loading user data...</div>;
  }

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <TiMessages className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">Start Messaging</h3>
        <p className="text-gray-400 text-sm sm:text-base">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div
      className="relative h-full overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#2A3447] scrollbar-track-[#0F172A]"
      ref={messageAreaRef}
    >
      {Array.isArray(messages) && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <TiMessages className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            Start Messaging
          </h3>
          <p className="text-gray-400 text-sm sm:text-base">
            Send private messages to {selectedUser.fullName}
          </p>
        </div>
      )}

      {groupedMessages.map((item, index) => (
        <React.Fragment key={index}>
          {item.type === "date" && (
            <div className="flex items-center justify-center my-4">
              <div className="bg-[#1E293B]/80 backdrop-blur-sm text-gray-400 text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-md">
                {formatDate(item.date)}
              </div>
            </div>
          )}
          {item.type === "message" && (
            <div
              className={`relative flex items-end gap-2 sm:gap-3 group ${
                item.message.senderId?._id.toString() === authUser._id.toString()
                  ? "justify-end"
                  : "justify-start"
              } animate-slideIn`}
            >
              {item.message.senderId._id.toString() !== authUser._id.toString() && (
                <img
                  src={
                    item.message.senderId?.avatar?.url ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  }
                  alt={item.message.senderId?.fullName || "User"}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover self-end hover:scale-105 transition-transform duration-300 cursor-pointer shadow-sm"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80")
                  }
                />
              )}

              <div
                className={`relative max-w-[70%] sm:max-w-[60%] ${
                  item.message.senderId._id.toString() === authUser._id.toString()
                    ? "order-1"
                    : "order-2"
                }`}
              >
                <div
                  className={`relative rounded-2xl p-3 sm:p-4 shadow-lg transition-all duration-300 ${
                    item.message.senderId._id.toString() === authUser._id.toString()
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-blue-500/40"
                      : "bg-[#1E293B]/90 backdrop-blur-lg text-white hover:shadow-gray-800/40"
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-5 pointer-events-none rounded-2xl"
                    aria-hidden="true"
                  />
                  {/* Dropdown Button */}
                  <button
                    onClick={() => toggleDropdown(item.message._id)}
                    className="absolute -top-2 -right-2 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-blue-500 dropdown"
                    title="Message Options"
                    aria-label="Message Options"
                  >
                    <FaAngleDown className="w-4 h-4 text-white" />
                  </button>
                  {/* Dropdown Menu */}
                  {dropdownMessageId === item.message._id && (
                    <div className="absolute right-0 top-6 bg-[#1E293B] rounded-lg shadow-lg z-10 dropdown overflow-hidden">
                      {item.message.type === "text" &&
                        !item.message.deletedFor?.includes(authUser._id) &&
                        !item.message.deletedForEveryone && (
                          <button
                            onClick={() => {
                              handleCopy(item.message.text);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#2A3447] hover:text-white w-full text-left transition-colors duration-200"
                            title="Copy Text"
                            aria-label="Copy Text"
                          >
                            <FaCopy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>
                        )}
                      <button
                        onClick={() => {
                          deleteMessageForMe(item.message._id);
                          setDropdownMessageId(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#2A3447] hover:text-white w-full text-left transition-colors duration-200"
                        title="Delete for Me"
                        aria-label="Delete for Me"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete for Me</span>
                      </button>
                      {item.message.senderId._id.toString() === authUser._id.toString() && (
                        <button
                          onClick={() => {
                            deleteMessageForEveryone(item.message._id);
                            setDropdownMessageId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-[#2A3447] hover:text-white w-full text-left transition-colors duration-200"
                          title="Delete for Everyone"
                          aria-label="Delete for Everyone"
                        >
                          <FaTrash className="w-4 h-4" />
                          <span>Delete for Everyone</span>
                        </button>
                      )}
                    </div>
                  )}
                  {renderMessageContent(item.message)}
                </div>

                <div
                  className={`flex items-center gap-2 mt-1 sm:mt-2 ${
                    item.message.senderId?._id.toString() === authUser._id.toString()
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <span className="text-xs sm:text-sm text-gray-400">
                    {item.message.createdAt
                      ? new Date(item.message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown time"}
                  </span>
                  {item.message.senderId._id.toString() === authUser._id.toString() &&
                    renderMessageStatus(item.message)}
                </div>
              </div>

              {item.message.senderId._id.toString() === authUser._id.toString() && (
                <img
                  src={
                    authUser?.avatar?.url ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                  }
                  alt="You"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover self-end hover:scale-105 transition-transform duration-300 cursor-pointer shadow-sm"
                  onError={(e) =>
                    (e.target.src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80")
                  }
                />
              )}
            </div>
          )}
        </React.Fragment>
      ))}

      {isTyping && (
        <div className="flex justify-start items-center gap-2 animate-fadeIn">
          <img
            src={
              selectedUser?.avatar?.url ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
            }
            alt={selectedUser?.fullName || "User"}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm"
          />
          <div className="bg-[#1E293B]/90 backdrop-blur-lg rounded-2xl p-3 sm:p-4 shadow-lg">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        </div>
      )}

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-bounce"
          title="Scroll to Bottom"
          aria-label="Scroll to Bottom"
        >
          <IoArrowDown className="w-5 h-5 text-white" />
        </button>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageArea;