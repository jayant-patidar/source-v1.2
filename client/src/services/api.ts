import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh or profile calls — checkAuth handles those explicitly
    const isAuthFlow = originalRequest.url?.includes('/users/profile') || originalRequest.url?.includes('/users/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthFlow) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await axios.post(`${API_URL}/users/refresh`, {}, { withCredentials: true });
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
