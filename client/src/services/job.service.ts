import api from './api';

export const jobService = {
  async getJobs(filters: any = {}) {
    // Clean up filters (remove empty/null values)
    const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    const { data } = await api.get('/jobs', { params });
    return data;
  },

  async getJob(id: string) {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  async getRecentJobs() {
    const { data } = await api.get('/jobs', { params: { limit: 5, sortBy: 'newest' } });
    return data;
  },

  async getRecommendedJobs() {
    const { data } = await api.get('/jobs', { params: { limit: 5 } });
    return data;
  },

  async createJob(jobData: any) {
    const { data } = await api.post('/jobs', jobData);
    return data;
  },

  async toggleSaveJob(id: string) {
    const { data } = await api.post(`/users/saved/${id}`);
    return data;
  },

  async getSavedJobs() {
    const { data } = await api.get('/users/saved');
    return data;
  },

  async getPostedJobs() {
    const { data } = await api.get('/jobs/posted');
    return data;
  },

  async getWorkedJobs() {
    const { data } = await api.get('/jobs/worked');
    return data;
  },

  async updateJob(id: string, updates: any) {
    const { data } = await api.put(`/jobs/${id}`, updates);
    return data;
  },

  async deleteJob(id: string) {
    const { data } = await api.delete(`/jobs/${id}`);
    return data;
  },

  async startJob(id: string) {
    const { data } = await api.put(`/jobs/${id}/start`);
    return data;
  },
  async approveStart(id: string) {
    const response = await api.put(`/jobs/${id}/approve-start`);
    return response.data;
  }
};
