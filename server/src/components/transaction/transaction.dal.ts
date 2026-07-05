import Transaction, { ITransaction } from './transaction.model';
import User from '../user/user.model';
import Job from '../job/job.model';
import mongoose from 'mongoose';

class TransactionDAL {
  async createTransaction(transactionData: Partial<ITransaction>, session?: mongoose.ClientSession): Promise<ITransaction> {
    const transaction = new Transaction(transactionData);
    return await transaction.save({ session });
  }

  async getTransactionsByUser(userId: string): Promise<ITransaction[]> {
    return await Transaction.find({
      $or: [{ payerId: userId }, { payeeId: userId }],
      currency: 'SourceCoin'
    }).sort({ createdAt: -1 }).populate('payerId payeeId jobId', 'name title');
  }

  async getTransactionsByJob(jobId: string): Promise<ITransaction[]> {
    return await Transaction.find({ jobId }).sort({ createdAt: -1 });
  }

  async updateUserBalance(userId: string, amountChange: number, session?: mongoose.ClientSession): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $inc: { 'wallet.balance': amountChange }
    }, { session });
  }

  async updateJobPaymentStatus(jobId: string, status: string, actorId: string, session?: mongoose.ClientSession): Promise<void> {
    await Job.findByIdAndUpdate(jobId, {
      paymentStatus: status,
      $push: { timeline: { status: 'paid', timestamp: new Date(), actorId } }
    }, { session });
  }
}

export default TransactionDAL;
