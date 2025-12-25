import api from './api';

export const authService = {
  async getProfile() {
    const { data } = await api.get('/users/profile');
    return data;
  },

  async login(credentials: any) {
    const { data } = await api.post('/users/login', credentials);
    return data;
  },

  async register(userData: any) {
    const { data } = await api.post('/users/register', userData);
    return data;
  },

  async logout() {
    await api.post('/users/logout', {});
  },

  async refreshToken() {
    await api.post('/users/refresh');
  }
};
