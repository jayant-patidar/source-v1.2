import api from './api';

export const transactionService = {
  async purchaseCoins(amount: number, method: string) {
    const { data } = await api.post('/transactions/purchase', { amount, method });
    return data;
  },

  async transferCoins(jobId: string, receiverId: string, amount: number) {
    const { data } = await api.post('/transactions/transfer', { jobId, receiverId, amount });
    return data;
  },

  async getUserTransactions() {
    const { data } = await api.get('/transactions/history');
    return data;
  },

  async getWalletBalance() {
    const { data } = await api.get('/transactions/balance');
    return data;
  },

  async getTransactionsByJob(jobId: string) {
    const { data } = await api.get(`/transactions/job/${jobId}`);
    return data;
  }
};
