// frontend/src/store/useChatStore.js
import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: null,
  socket: null,
  typingUsers: new Map(),
  onlineUsers: [],

  setSelectedUser: (user) => set({ selectedUser: user }),

  setSocket: (socket) => {
    set({ socket, typingUsers: new Map() });

    socket.on("onlineUsers", (users) => {
      set({ onlineUsers: Array.isArray(users) ? users : [] });
    });

    socket.on("newMessage", ({ message, conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
      get().getUsers();
    });

    socket.on("messageDelivered", ({ messageId, conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  deliveredTo: [...(msg.deliveredTo || []), get().selectedUser._id],
                }
              : msg
          ),
        }));
      }
    });

    socket.on("messageRead", ({ messageId, conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId
              ? { ...msg, readBy: [...(msg.readBy || []), get().selectedUser._id] }
              : msg
          ),
        }));
      }
    });

    socket.on("messageDeletedForMe", ({ messageId, conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId
              ? { ...msg, deletedFor: [...(msg.deletedFor || []), useAuthStore.getState().authUser._id] }
              : msg
          ),
        }));
      }
      get().getUsers();
    });

    socket.on("messageDeletedForEveryone", ({ messageId, conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId
              ? { ...msg, deletedForEveryone: true, deletedFor: [msg.senderId, msg.receiverId] }
              : msg
          ),
        }));
      }
      get().getUsers();
    });

    socket.on("typing", ({ conversationId, userId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => {
          const newTypingUsers = new Map(state.typingUsers);
          newTypingUsers.set(conversationId, userId);
          return { typingUsers: newTypingUsers };
        });
      }
    });

    socket.on("stopTyping", ({ conversationId }) => {
      if (get().selectedUser?.conversationId === conversationId) {
        set((state) => {
          const newTypingUsers = new Map(state.typingUsers);
          newTypingUsers.delete(conversationId);
          return { typingUsers: newTypingUsers };
        });
      }
    });
  },

  disconnectSocket: () => {
    set({ socket: null, typingUsers: new Map(), onlineUsers: [] });
  },

  getUsers: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/messages/users");
      const fetchedUsers = Array.isArray(res.data.data) ? res.data.data : [];
      set({ users: fetchedUsers });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
      set({
        users: [],
        error: error.response?.data?.message || "Failed to fetch users",
      });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConversation: async (userId) => {
    if (!userId) {
      throw new Error("Invalid user ID provided for conversation");
    }
    try {
      const res = await axiosInstance.post("/messages/conversation", {
        receiverId: userId,
      });
      if (!res.data.data?.conversationId) {
        throw new Error("No conversation ID returned from server");
      }
      return res.data.data.conversationId;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to get conversation");
      throw error;
    }
  },

  getMessages: async (conversationId, page = 1, limit = 20) => {
    if (!conversationId) {
      toast.error("Cannot fetch messages: No conversation selected");
      set({ messages: [], isMessagesLoading: false });
      return;
    }

    set({ isMessagesLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/messages/${conversationId}`, {
        params: { page, limit },
      });
      set((state) => ({
        messages:
          page === 1
            ? res.data.data.messages
            : [...state.messages, ...res.data.data.messages],
        pagination: {
          page: res.data.data.page,
          limit: res.data.data.limit,
        },
      }));
      await get().getUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
      set({
        messages: [],
        error: error.response?.data?.message || "Failed to fetch messages",
      });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  selectUser: async (user) => {
    if (!user?._id) {
      toast.error("Invalid user selected");
      return;
    }

    set({ isMessagesLoading: true, error: null });
    try {
      const conversationId = await get().getConversation(user._id);
      const updatedUser = { ...user, conversationId };
      set({ selectedUser: updatedUser, messages: [], typingUsers: new Map() });
      await get().getMessages(conversationId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to select user");
      set({
        selectedUser: null,
        messages: [],
        isMessagesLoading: false,
        error: error.message,
      });
    }
  },

  sendMessage: async (formData) => {
    const { selectedUser, messages, socket } = get();

    if (!selectedUser?._id) {
      toast.error("No recipient selected");
      return;
    }

    let conversationId = selectedUser.conversationId;
    if (!conversationId) {
      conversationId = await get().getConversation(selectedUser._id);
      set({ selectedUser: { ...selectedUser, conversationId } });
    }

    let finalFormData = formData instanceof FormData ? formData : new FormData();
    if (!(formData instanceof FormData)) {
      if (formData.text) finalFormData.append("text", formData.text);
      if (formData.file) finalFormData.append("file", formData.file);
      if (formData.type) finalFormData.append("type", formData.type);
      finalFormData.append("receiverId", selectedUser._id);
      finalFormData.append("conversationId", conversationId);
    } else {
      finalFormData.set("receiverId", selectedUser._id);
      finalFormData.set("conversationId", conversationId);
    }

    try {
      const res = await axiosInstance.post("/messages/send", finalFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newMessage = res.data.data;
      set({ messages: [...messages, newMessage] });
      if (socket) {
        socket.emit("sendMessage", {
          message: newMessage,
          conversationId,
          receiverId: selectedUser._id,
        });
      }
      toast.success("Message sent successfully");
      await get().getUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  deleteMessageForMe: async (messageId) => {
    const { socket, selectedUser } = get();
    try {
      await axiosInstance.delete(`/messages/delete-for-me/${messageId}`);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, deletedFor: [...(msg.deletedFor || []), useAuthStore.getState().authUser._id] }
            : msg
        ),
      }));
      if (socket && selectedUser?.conversationId) {
        socket.emit("deleteMessageForMe", {
          messageId,
          conversationId: selectedUser.conversationId,
          deletedBy: useAuthStore.getState().authUser._id,
        });
      }
      toast.success("Message deleted for you");
      await get().getUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  },

  deleteMessageForEveryone: async (messageId) => {
    const { socket, selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    const message = messages.find((msg) => msg._id === messageId);

    if (!message || message.senderId._id !== authUser._id) {
      toast.error("Only the sender can delete this message for everyone");
      return;
    }

    try {
      await axiosInstance.delete(`/messages/delete-for-everyone/${messageId}`);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, deletedForEveryone: true, deletedFor: [msg.senderId, msg.receiverId] }
            : msg
        ),
      }));
      if (socket && selectedUser?.conversationId) {
        socket.emit("deleteMessageForEveryone", {
          messageId,
          conversationId: selectedUser.conversationId,
          deletedBy: authUser._id,
        });
      }
      toast.success("Message deleted for everyone");
      await get().getUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  },

  startTyping: () => {
    const { socket, selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;
    if (socket && selectedUser?.conversationId && authUser?._id) {
      socket.emit("typing", {
        conversationId: selectedUser.conversationId,
        userId: authUser._id,
        receiverId: selectedUser._id,
      });
    }
  },

  stopTyping: () => {
    const { socket, selectedUser } = get();
    if (socket && selectedUser?.conversationId) {
      socket.emit("stopTyping", {
        conversationId: selectedUser.conversationId,
        receiverId: selectedUser._id,
      });
    }
  },

  markMessageAsRead: async (messageId) => {
    const { socket, selectedUser } = get();
    try {
      await axiosInstance.patch(`/messages/read/${messageId}`);
      if (socket && selectedUser?.conversationId) {
        socket.emit("messageRead", {
          messageId,
          conversationId: selectedUser.conversationId,
          senderId: get().messages.find((msg) => msg._id === messageId)
            ?.senderId._id,
        });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  },
}));