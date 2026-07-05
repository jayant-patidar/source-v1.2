import mongoose from 'mongoose';
import TransactionDAL from './transaction.dal';
import User from '../user/user.model';
import Job from '../job/job.model';

class TransactionService {
  private transactionDAL: TransactionDAL;

  constructor() {
    this.transactionDAL = new TransactionDAL();
  }

  async purchaseCoins(userId: string, amount: number, method: 'credit_card' | 'etransfer' | 'in-app'): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Create a purchase transaction
      const transaction = await this.transactionDAL.createTransaction({
        payeeId: new mongoose.Types.ObjectId(userId), // Using payeeId for the receiver of purchased coins
        amount,
        type: 'purchase',
        paymentMethod: method,
        status: 'success',
        currency: 'SourceCoin'
      }, session);

      // Add coins to wallet
      await this.transactionDAL.updateUserBalance(userId, amount, session);

      await session.commitTransaction();
      session.endSession();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async transferCoinsForJob(jobId: string, senderId: string, receiverId: string, amount: number): Promise<any> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. Verify Sender has sufficient balance
      const sender = await User.findById(senderId).session(session);
      if (!sender || !sender.wallet || sender.wallet.balance < amount) {
        throw new Error('Insufficient SourceCoin balance');
      }

      // 2. Create the transfer transaction
      const transaction = await this.transactionDAL.createTransaction({
        jobId: new mongoose.Types.ObjectId(jobId),
        payerId: new mongoose.Types.ObjectId(senderId),
        payeeId: new mongoose.Types.ObjectId(receiverId),
        amount,
        type: 'transfer',
        paymentMethod: 'sourcecoin',
        status: 'success',
        currency: 'SourceCoin'
      }, session);

      // 3. Deduct from Sender
      await this.transactionDAL.updateUserBalance(senderId, -amount, session);

      // 4. Add to Receiver
      await this.transactionDAL.updateUserBalance(receiverId, amount, session);

      // 5. Update Job Payment Status
      await this.transactionDAL.updateJobPaymentStatus(jobId, 'paid', senderId, session);

      await session.commitTransaction();
      session.endSession();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getUserTransactions(userId: string): Promise<any[]> {
    return await this.transactionDAL.getTransactionsByUser(userId);
  }

  async getTransactionsByJob(jobId: string): Promise<any[]> {
    return await this.transactionDAL.getTransactionsByJob(jobId);
  }
}

export default TransactionService;
