import { create } from 'zustand';
import { transactionService } from '../services/transaction.service';

interface TransactionState {
  balance: number;
  transactions: any[];
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  purchaseCoins: (amount: number, method: string) => Promise<void>;
  transferCoins: (jobId: string, receiverId: string, amount: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      const data = await transactionService.getWalletBalance();
      set({ balance: data.wallet.balance });
    } catch (error: any) {
      console.error('Failed to fetch balance:', error);
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await transactionService.getUserTransactions();
      set({ transactions: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  purchaseCoins: async (amount, method) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.purchaseCoins(amount, method);
      const balanceData = await transactionService.getWalletBalance();
      const txData = await transactionService.getUserTransactions();
      set({ balance: balanceData.wallet.balance, transactions: txData, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  transferCoins: async (jobId, receiverId, amount) => {
    set({ isLoading: true, error: null });
    try {
      await transactionService.transferCoins(jobId, receiverId, amount);
      const balanceData = await transactionService.getWalletBalance();
      const txData = await transactionService.getUserTransactions();
      set({ balance: balanceData.wallet.balance, transactions: txData, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  }
}));
