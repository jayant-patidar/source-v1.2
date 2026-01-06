import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'counter_offer_received' | 'job_update';
  job: mongoose.Types.ObjectId;
  negotiation?: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['offer_received', 'offer_accepted', 'offer_rejected', 'counter_offer_received', 'job_update'], 
      required: true 
    },
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    negotiation: { type: Schema.Types.ObjectId, ref: 'Negotiation' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', notificationSchema);
