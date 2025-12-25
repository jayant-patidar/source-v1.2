import api from './api';

export const transactionService = {
  async getTransactionsByJob(jobId: string) {
    const { data } = await api.get(`/transactions/job/${jobId}`);
    return data;
  },
  
  // Method inferred from PaymentPage usage (likely) or future needs
  async createTransaction(payload: any) {
      const { data } = await api.post('/transactions', payload);
      return data;
  }
};
