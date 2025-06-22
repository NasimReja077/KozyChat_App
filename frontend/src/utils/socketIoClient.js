// frontend/src/utils/socketIoClient.js
import { io } from "socket.io-client";

export const initializeSocket = (userId) => {
  const socketUrl = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";
  const socket = io(socketUrl, {
    query: { userId },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("join", userId);
  });

  socket.on("connect_error", (error) => {
    console.error("Connection failed:", error.message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const disconnectSocket = (socket) => {
  if (socket) {
    socket.disconnect();
  }
};