// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import ChatPage from "./Pages/ChatPage.jsx";
import ErrorPage from "./Pages/ErrorPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { useChatStore } from "./store/useChatStore.js";
import { useEffect } from "react";
import { CgSpinner } from "react-icons/cg";
import { Toaster } from "react-hot-toast";
import { initializeSocket, disconnectSocket } from "./utils/socketIoClient.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { setSocket } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    let socket = null;
    if (authUser?._id) {
      socket = initializeSocket(authUser._id);
      setSocket(socket);
    }
    return () => {
      if (socket) {
        disconnectSocket(socket);
      }
    };
  }, [authUser?._id, setSocket]); // Add authUser?._id as dependency

  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100">
        <CgSpinner className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="text-lg font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/chats" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/chats" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chats"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;