import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  job: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  response?: {
    message: string;
    createdAt: Date;
  };
}

const reviewSchema = new Schema<IReview>(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    response: {
      message: { type: String },
      createdAt: { type: Date }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', reviewSchema);
