import { Server } from "socket.io";

const onlineUsers = new Map();

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (userId) => {
      if (!userId || typeof userId !== "string") {
        console.error(`Invalid userId for join: ${userId}`);
        return;
      }
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("typing", ({ conversationId, userId, receiverId }) => {
      if (!conversationId || !userId || !receiverId) {
        console.error("Invalid typing event data:", { conversationId, userId, receiverId });
        return;
      }
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { conversationId, userId });
      }
    });

    socket.on("stopTyping", ({ conversationId, receiverId }) => {
      if (!conversationId || !receiverId) {
        console.error("Invalid stopTyping event data:", { conversationId, receiverId });
        return;
      }
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { conversationId });
      }
    });

    socket.on("sendMessage", ({ message, conversationId, receiverId }) => {
      if (!message?._id || !conversationId || !receiverId) {
        console.error("Invalid sendMessage event data:", { message, conversationId, receiverId });
        return;
      }
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", { message, conversationId });
        socket.emit("messageDelivered", { messageId: message._id, conversationId });
      } else {
        console.log(`Receiver ${receiverId} not online for message ${message._id}`);
      }
    });

    socket.on("messageRead", ({ messageId, conversationId, senderId }) => {
      if (!messageId || !conversationId || !senderId) {
        console.error("Invalid messageRead event data:", { messageId, conversationId, senderId });
        return;
      }
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", { messageId, conversationId });
      }
    });

    socket.on("deleteMessageForMe", ({ messageId, conversationId, deletedBy }) => {
      if (!messageId || !conversationId || !deletedBy) {
        console.error("Invalid deleteMessageForMe event data:", { messageId, conversationId, deletedBy });
        return;
      }
      const otherUserSocketId = onlineUsers.get(deletedBy);
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit("messageDeletedForMe", {
          messageId,
          conversationId,
          deletedBy,
        });
      }
    });

    socket.on("deleteMessageForEveryone", ({ messageId, conversationId, deletedBy }) => {
      if (!messageId || !conversationId || !deletedBy) {
        console.error("Invalid deleteMessageForEveryone event data:", { messageId, conversationId, deletedBy });
        return;
      }
      const otherUserSocketId = onlineUsers.get(deletedBy);
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit("messageDeletedForEveryone", {
          messageId,
          conversationId,
          deletedBy,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected: ${reason}`);
          io.emit("onlineUsers", Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });

  io.on("error", (error) => {
    console.error("Socket.IO server error:", error);
  });

  return { io, onlineUsers };
};