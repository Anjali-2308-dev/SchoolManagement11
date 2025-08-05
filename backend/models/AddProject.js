import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    class: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: String, required: true },
    description: { type: String, required: true },
    submissions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 30 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
