
import api from '../api/api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  async login(credentials: any) {
    const { data } = await api.post('/users/login', credentials);
    if (data.token) {
        await SecureStore.setItemAsync('token', data.token);
    }
    return data;
  },

  async register(userData: any) {
    const { data } = await api.post('/users/register', userData);
    if (data.token) {
        await SecureStore.setItemAsync('token', data.token);
    }
    return data;
  },

  async logout() {
    try {
        await api.post('/users/logout', {});
    } catch (e) {
        // Ignore logout errors
    } finally {
        await SecureStore.deleteItemAsync('token');
    }
  },

  async getProfile() {
    const { data } = await api.get('/users/profile');
    return data;
  },
};
