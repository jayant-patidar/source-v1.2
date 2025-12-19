import { Request, Response } from 'express';
import Transaction from './transaction.model';
import Job from '../job/job.model';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { jobId, payorId, payeeId, amount, paymentMethod, metadata } = req.body;

    const transaction = new Transaction({
      jobId,
      payerId: payorId,
      payeeId,
      amount,
      paymentMethod,
      status: 'success', // Mocking success for now
      metadata
    });

    await transaction.save();

    // Update Job Payment Status and Timeline
    await Job.findByIdAndUpdate(jobId, { 
      paymentStatus: 'paid',
      $push: { timeline: { status: 'paid', timestamp: new Date(), actorId: payorId } }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create Transaction Error:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
};

export const getTransactionsByJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const transactions = await Transaction.find({ jobId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};
