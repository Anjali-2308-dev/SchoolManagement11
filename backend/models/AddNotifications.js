import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    audience: {
      type: String,
      required: true,
    },
    sentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Sent', 'Failed', 'Pending'],
      default: 'Sent',
    },
    recipients: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
