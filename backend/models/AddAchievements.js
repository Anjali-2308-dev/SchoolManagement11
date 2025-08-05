import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
  student: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true }, // or Date if you prefer
  description: { type: String, required: true },
  fileUrl: { type: String }, // path to uploaded file (image/pdf)
  fileType: { type: String }, // e.g. 'image/png', 'application/pdf'
  uploadDate: { type: Date, default: Date.now }
});

const Achievement =mongoose.model('Achievement', AchievementSchema);
export default Achievement;