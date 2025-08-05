
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
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
      enum: [
        'All Classes',
        'Class 10A',
        'Class 10B',
        'Parents Only'
      ],
    },
    deliveryMethod: {
      type: String,
      required: true,
      enum: [
        'App'
      ],
      default: 'App',
    },
    date: {
      type: String, 
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
