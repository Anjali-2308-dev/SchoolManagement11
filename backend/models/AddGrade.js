import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  class: { type: String, required: true },
  math: { type: Number, required: true },
  english: { type: Number, required: true },
  science: { type: Number, required: true },
  socialStudies: { type: Number, required: true },
  computer: { type: Number, required: true },
  hindi: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  average: { type: Number, required: true },
  grade: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);