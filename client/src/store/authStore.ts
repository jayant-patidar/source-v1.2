import { create } from 'zustand';
import { authService } from '../services/auth.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  seekerRating?: number;
  providerRating?: number;
  DOB?: string;
  phone?: string;
  address?: {
    unit?: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
    county?: string;
  };
  providerProfile?: {
    skills: string[];
    serviceCategories: string[];
    serviceRadius?: number;
    availability?: string;
  };
  seekerProfile?: {
    requestCategories: string[];
    preferredTopics: string[];
    defaultLocation?: string;
  };
  about?: string;
  preferences?: {
    jobTypes: string[];
    categories: string[];
    minPay?: number;
    location?: string;
  };
  skills?: string[];
  portfolio?: {
    title: string;
    link: string;
    description?: string;
  }[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  availability?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  checkAuth: async () => {
    try {
      const user = await authService.getProfile();
      set({ user, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(credentials);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(userData);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
        await authService.logout();
    } catch (error) {
        console.error("Logout failed", error);
    } finally {
        set({ user: null });
    }
  },

  clearError: () => set({ error: null }),
}));
