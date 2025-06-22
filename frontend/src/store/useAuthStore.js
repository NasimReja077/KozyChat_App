// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLogin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.data });
    } catch (error) {
      console.error("Error in CheckAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data });
      toast.success("Account Created successfully");
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (data) => {
    set({ isLogin: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data.user });
      toast.success("Logged in Successfully");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      set({ isLogin: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout Failed.");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error in updateProfile:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Profile update failed");
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));