
import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Replace with your computer's local IP address
// localhost works for iOS simulator, but for Android Emulator use 10.0.2.2
// For physical devices, use your machine's LAN IP (e.g., 192.168.1.X)
const LOCAL_IP = '10.0.0.22'; // Updated to your actual LAN IP
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000/api' : `http://${LOCAL_IP}:5000/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handle Auth Errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('token');
      // Navigation to login should be handled by the store state change
    }
    return Promise.reject(error);
  }
);

export default api;
