import mongoose, { Document, Schema } from 'mongoose';

export interface INegotiation extends Document {
  job: mongoose.Types.ObjectId;
  seeker: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const negotiationSchema = new Schema<INegotiation>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<INegotiation>('Negotiation', negotiationSchema);
