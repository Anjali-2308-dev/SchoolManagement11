
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: { type: String, default: '/placeholder.svg' },
  uploadDate: { type: String }, // format: 'YYYY-MM-DD'
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
