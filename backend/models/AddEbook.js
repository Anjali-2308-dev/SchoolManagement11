import mongoose from 'mongoose';

const EBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  fileSize: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  coverImageUrl: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

const EBook = mongoose.model('EBook', EBookSchema);
export default EBook;