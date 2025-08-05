import mongoose from 'mongoose';

const TeacherFeedbackSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Academic', 'Behavioral', 'Other'],
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Reviewed', 'Pending'],
    default: 'Submitted',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
});

export default mongoose.model('TeacherFeedback', TeacherFeedbackSchema);
