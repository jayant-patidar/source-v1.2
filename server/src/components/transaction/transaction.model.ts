import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  jobId?: mongoose.Types.ObjectId;
  payerId?: mongoose.Types.ObjectId;
  payeeId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  type: 'payment' | 'purchase' | 'transfer';
  paymentMethod: 'credit_card' | 'paypal' | 'etransfer' | 'in-app' | 'sourcecoin';
  status: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: false },
    payerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    payeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    type: {
      type: String,
      default: 'payment',
      enum: ['payment', 'purchase', 'transfer'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['credit_card', 'paypal', 'etransfer', 'in-app', 'sourcecoin'],
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
