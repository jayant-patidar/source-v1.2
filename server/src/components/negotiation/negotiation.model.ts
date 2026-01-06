import mongoose, { Document, Schema } from 'mongoose';

export interface INegotiation extends Document {
  job: mongoose.Types.ObjectId;
  seeker: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  seekerCounterCount: number;
  providerCounterCount: number;
  lastActor: 'seeker' | 'provider';
  offerHistory: {
    amount: number;
    message?: string;
    actor: 'seeker' | 'provider';
    timestamp: Date;
  }[];
}

const negotiationSchema = new Schema<INegotiation>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    seeker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'countered'], default: 'pending' },
    seekerCounterCount: { type: Number, default: 0 },
    providerCounterCount: { type: Number, default: 0 },
    lastActor: { type: String, enum: ['seeker', 'provider'] },
    offerHistory: [
      {
        amount: { type: Number, required: true },
        message: { type: String },
        actor: { type: String, enum: ['seeker', 'provider'], required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<INegotiation>('Negotiation', negotiationSchema);
