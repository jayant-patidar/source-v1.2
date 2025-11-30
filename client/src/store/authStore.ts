import { create } from 'zustand';
import axios from 'axios';

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
  address?: string;
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

const API_URL = 'http://localhost:5000/api/users';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: false,
  error: null,

  checkAuth: async () => {
    try {
      const { data } = await api.get('/profile');
      set({ user: data, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/login', credentials);
      set({ user: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/register', userData);
      set({ user: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await api.post('/logout', {});
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
