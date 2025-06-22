import React, { useRef, useState, useEffect } from "react";
import { RiChatSmile3Fill } from "react-icons/ri";
import { PiPaperclipFill } from "react-icons/pi";
import { BsSendFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosGift } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import { useChatStore } from "../../store/useChatStore.js";
import toast from "react-hot-toast";

function MessageInput() {
  const fileInputRef = useRef(null);
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const { sendMessage, startTyping, stopTyping, selectedUser } = useChatStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit.");
        return;
      }
      setAttachment(file);
      setAttachmentPreview(URL.createObjectURL(file));
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleGifClick = async (gifObject) => {
    if (!selectedUser?._id) {
      return toast.error("No recipient selected.");
    }

    setIsSending(true);
    const formData = new FormData();
    formData.append("text", text.trim());
    formData.append("receiverId", selectedUser._id);
    formData.append("type", "gif");
    formData.append("gifUrl", gifObject.url);
    formData.append("conversationId", selectedUser.conversationId || "");

    try {
      await sendMessage(formData);
      setText("");
      setShowGifPicker(false);
      toast.success("GIF sent successfully");
    } catch (error) {
      console.error("Failed to send GIF:", error);
      toast.error(error?.response?.data?.message || "Failed to send GIF");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !attachment) return;

    if (!selectedUser?._id) {
      return toast.error("No recipient selected.");
    }

    setIsSending(true);
    const formData = new FormData();
    let messageType = "text";

    if (attachment) {
      const mimeType = attachment.type;
      if (mimeType.startsWith("image/")) messageType = "image";
      else if (mimeType.startsWith("video/")) messageType = "video";
      else messageType = "file";
      formData.append("file", attachment);
    }

    formData.append("text", text.trim());
    formData.append("receiverId", selectedUser._id);
    formData.append("type", messageType);
    formData.append("conversationId", selectedUser.conversationId || "");

    try {
      await sendMessage(formData);
      setText("");
      removeAttachment();
      stopTyping();
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      startTyping();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping();
    }, 2000); // Stop typing after 2 seconds of inactivity
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        stopTyping();
      }
    };
  }, [isTyping, stopTyping]);

  return (
    <div className="p-4 sm:p-6 border-t border-[#1A1E2E]/50 relative bg-[#0F172A]">
      {attachmentPreview && (
        <div className="flex items-center gap-3 p-3 sm:p-4 mb-4 bg-[#1E293B]/90 backdrop-blur-lg rounded-xl shadow-xl animate-slideIn border border-[#374151]/50 transition-all duration-300 hover:shadow-blue-500/20">
          {attachment?.type?.startsWith("image/") ? (
            <div className="relative group">
              <img
                src={attachmentPreview}
                alt="Attachment preview"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-blue-500/60 shadow-md transition-all duration-300 group-hover:scale-105"
              />
              <button
                onClick={removeAttachment}
                className="absolute top-[-12px] right-[-12px] bg-red-500/90 p-1 rounded-full hover:bg-red-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Remove Attachment"
              >
                <IoMdCloseCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-blue-500/20 rounded-lg flex items-center gap-3 shadow-sm transition-all duration-300 hover:bg-blue-500/30">
              <span className="text-sm sm:text-base font-medium text-gray-300 truncate max-w-[200px] sm:max-w-[300px]">{attachment.name}</span>
              <button
                onClick={removeAttachment}
                className="text-red-400 hover:text-red-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                title="Remove Attachment"
              >
                <IoMdCloseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className={`flex items-center gap-2 sm:gap-3 bg-[#1E293B]/90 backdrop-blur-lg rounded-xl p-3 sm:p-4 shadow-xl border border-[#2A3447]/50 transition-all duration-300
          ${isFocused ? 'border-blue-500/60 shadow-blue-500/30 scale-[1.01]' : 'hover:border-blue-500/40 hover:shadow-blue-500/20'}`}
      >
        <button
          type="button"
          className="p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowGifPicker(false);
          }}
          title="Emojis"
          disabled={isSending}
        >
          <RiChatSmile3Fill className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-yellow-400 transition-colors" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-20 sm:bottom-24 left-4 sm:left-6 z-10 bg-[#1E293B] p-2 rounded-xl shadow-xl animate-slideIn">
            <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width="320px" height="400px" />
          </div>
        )}

        <button
          type="button"
          className="p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            setShowGifPicker(!showGifPicker);
            setShowEmojiPicker(false);
          }}
          title="GIFs"
          disabled={isSending}
        >
          <IoIosGift className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-pink-400 transition-colors" />
        </button>

        {showGifPicker && (
          <div className="absolute bottom-20 sm:bottom-24 left-4 sm:left-6 z-10 bg-[#1E293B] p-2 rounded-xl shadow-xl animate-slideIn">
            {isSending && (
              <div className="absolute inset-0 bg-[#1E293B]/80 flex items-center justify-center rounded-xl">
                <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            <GifPicker
              tenorApiKey="YOUR_TENOR_API_KEY"
              onGifClick={handleGifClick}
              theme="dark"
              width="360px"
              height="480px"
            />
          </div>
        )}

        <label className="p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out hover:bg-[#2A3447] hover:scale-110 cursor-pointer">
          <PiPaperclipFill className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-blue-400 transition-colors" />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx"
            disabled={isSending}
          />
        </label>

        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-400/70 text-sm sm:text-base font-medium px-2 sm:px-4 transition-all duration-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
          disabled={isSending}
        />

        <button
          type="submit"
          className={`p-2 sm:p-3 rounded-full transition-all duration-300 ease-in-out transform shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500
            ${(text.trim() || attachment) && !isSending ? "bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-110" : "bg-gray-600/50 cursor-not-allowed"}`}
          disabled={(!text.trim() && !attachment) || isSending}
          title="Send"
        >
          {isSending ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <BsSendFill className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;