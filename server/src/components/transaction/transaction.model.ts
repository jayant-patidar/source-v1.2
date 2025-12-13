import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  jobId: mongoose.Types.ObjectId;
  payerId: mongoose.Types.ObjectId;
  payeeId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'paypal' | 'etransfer';
  status: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'etransfer'],
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'failed', 'pending'],
    },
    metadata: { type: Object, required: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
