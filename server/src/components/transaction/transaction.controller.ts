import { Request, Response } from 'express';
import TransactionService from './transaction.service';
import User from '../user/user.model';

class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  purchaseCoins = async (req: any, res: Response) => {
    try {
      const { amount, method } = req.body;
      const userId = req.user._id;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }

      const transaction = await this.transactionService.purchaseCoins(userId, amount, method || 'credit_card');
      res.status(201).json({ message: 'Coins purchased successfully', transaction });
    } catch (error: any) {
      console.error('Purchase Coins Error:', error);
      res.status(500).json({ message: error.message || 'Failed to purchase coins' });
    }
  };

  transferCoins = async (req: any, res: Response) => {
    try {
      const { jobId, receiverId, amount } = req.body;
      const senderId = req.user._id;

      if (!jobId || !receiverId || !amount) {
        return res.status(400).json({ message: 'Missing required fields for transfer' });
      }

      const transaction = await this.transactionService.transferCoinsForJob(jobId, senderId, receiverId, amount);
      res.status(200).json({ message: 'Coins transferred successfully', transaction });
    } catch (error: any) {
      console.error('Transfer Coins Error:', error);
      res.status(400).json({ message: error.message || 'Failed to transfer coins' });
    }
  };

  getUserTransactions = async (req: any, res: Response) => {
    try {
      const userId = req.user._id;
      const transactions = await this.transactionService.getUserTransactions(userId);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Get User Transactions Error:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  };

  getTransactionsByJob = async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const transactions = await this.transactionService.getTransactionsByJob(jobId);
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Get Job Transactions Error:', error);
      res.status(500).json({ message: 'Failed to fetch job transactions' });
    }
  };

  getWalletBalance = async (req: any, res: Response) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).select('wallet');
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      res.status(200).json({ wallet: user.wallet || { balance: 0, currency: 'SourceCoin' } });
    } catch (error) {
      console.error('Get Wallet Balance Error:', error);
      res.status(500).json({ message: 'Failed to fetch wallet balance' });
    }
  };
}

export default new TransactionController();
