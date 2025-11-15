import { create } from "zustand"; //it is for global state management
import axios from "../lib/axios"; //importing axios instance
import { toast } from "react-hot-toast"; //for showing notifications
import { Check } from "lucide-react";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data.user, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log("User is here:", res.data); // Debug log
      set({ user: res.data.user, loading: false }); // ← Extract user object
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log("Auth check failed:", error);
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed. Please try again.",
      );
    }
  },
}));

//Todo : Implement the axios interceptor for refreshing access tokens 15m
