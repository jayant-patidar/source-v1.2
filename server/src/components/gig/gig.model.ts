import mongoose, { Schema, Document } from 'mongoose';

export interface IGig extends Document {
  providerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  expirationDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GigSchema: Schema = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    expirationDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IGig>('Gig', GigSchema);
