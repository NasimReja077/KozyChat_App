// frontend/src/Pages/ChatPage.jsx
import React from 'react';
import NaveSideBar from '../components/NaveSideBar';
import LeftChatsBar from '../components/LeftComponent/LaftChatsBar';
import { useChatStore } from '../store/useChatStore';
import NoChatSelected from '../components/NoChatSelected';
import RightMessageBox from '../components/RightComponent/RightMessageBox';

function ChatPage() {
  const { selectedUser } = useChatStore();
  
  return (
    <div className='flex h-screen overflow-hidden'>
      <NaveSideBar />
      <LeftChatsBar />
      {!selectedUser ? <NoChatSelected /> : <RightMessageBox /> }
    </div>
  );
}
export default ChatPage;