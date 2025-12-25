import api from './api';

export const offerService = {
  async createOffer(offerData: { jobId: string; amount: number; message?: string }) {
    const { data } = await api.post('/negotiations', offerData);
    return data;
  },

  async getOffersByJob(jobId: string) {
    const { data } = await api.get(`/negotiations/${jobId}`);
    return data;
  },

  async getReceivedOffers() {
    const { data } = await api.get('/negotiations/received');
    return data;
  },

  async getSentOffers() {
     // Confirmed endpoint from SentOffersView
    const { data } = await api.get('/negotiations/my-offers');
    return data;
  },

  async updateOfferStatus(id: string, status: 'accepted' | 'rejected') {
    const { data } = await api.put(`/negotiations/${id}`, { status });
    return data;
  }
};
