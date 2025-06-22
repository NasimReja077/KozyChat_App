// frontend/src/components/RightComponent/RightMessageBox.jsx
import React, { useEffect } from 'react';
import MessageHeader from './MessageHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import { useChatStore } from '../../store/useChatStore';
import MessageSkeleton from '../skeletons/MessageSkeleton';
import NoChatSelected from '../NoChatSelected'; // Import NoChatSelected

const RightMessageBox = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, error } = useChatStore();

  useEffect(() => {
    if (selectedUser?.conversationId) {
      console.log("Fetching messages for conversation:", selectedUser.conversationId);
      getMessages(selectedUser.conversationId);
    }
  }, [selectedUser?.conversationId]);

  // Render NoChatSelected if no user is selected
  if (!selectedUser) {
    return <NoChatSelected />;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MessageHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MessageHeader />
        <div className="flex-1 p-4 text-center text-gray-400">
          <p>Error: {error}</p>
          <p>Please try selecting the user again.</p>
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className='flex-1 bg-[#0a0d17] text-[#e8f7fa] flex flex-col shadow-lg overflow-hidden'>
      <MessageHeader />
      <div className='flex-1 p-4 overflow-y-auto custom-scrollbar'>
        <MessageArea />
      </div>
      <MessageInput />
    </div>
  );
};

export default RightMessageBox;