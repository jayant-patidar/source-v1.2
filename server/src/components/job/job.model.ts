import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  providerId?: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  jobDate: Date;
  jobTime: string;
  originalPay: number;
  currentPay?: number;
  updatedPay: { pay: number; updatedAt: Date }[];
  location: {
    general: string;
    exact: string;
  };
  visibility: boolean;
  isNegotiable: boolean;
  expirationDate: Date;
  category: string;
  status: 'open' | 'accepted' | 'in_progress' | 'completed' | 'canceled';
  type?: string;
  tags?: string[];
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobDate: { type: Date, required: true },
    jobTime: { type: String, required: true },
    originalPay: { type: Number, required: true },
    currentPay: { type: Number, required: false },
    updatedPay: [
      {
        pay: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    location: {
      general: { type: String, required: true },
      exact: { type: String, required: true },
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    isNegotiable: { type: Boolean, default: false },
    expirationDate: { type: Date, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      default: 'open',
      enum: ['open', 'accepted', 'in_progress', 'completed', 'canceled'],
    },
    type: { type: String, required: false },
    tags: { type: [String], required: false },
    requirements: { type: [String], required: false },
  },
  { timestamps: true }
);

// Add geospatial index if needed later, for now keeping it simple as per request
// JobSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.model<IJob>('Job', JobSchema);
