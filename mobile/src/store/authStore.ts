
import { create } from 'zustand';
import { authService } from '../services/auth.service';
import * as SecureStore from 'expo-secure-store';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  seekerRating?: number;
  providerRating?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const user = await authService.getProfile();
        set({ user });
      }
    } catch (error) {
      // Token invalid or network error
      await SecureStore.deleteItemAsync('token');
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(userData);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
        await authService.logout();
    } finally {
        set({ user: null });
    }
  },

  clearError: () => set({ error: null }),
}));
