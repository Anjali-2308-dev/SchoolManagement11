import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    duration: { type: Number, required: true },
    questions: { type: Number, required: true },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    attempts: { type: Number, default: 0 },
    date: {
  type: Date,
  required: true,
}

  },
  { timestamps: true }
);

export default mongoose.model('Test', testSchema);
