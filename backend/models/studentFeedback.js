import mongoose from 'mongoose';

const TeacherFeedbackSchema = new mongoose.Schema({
  teacher: {
    type: String,
    required: true,
    enum: ['ramesh', 'priya', 'kiran', 'sneha'],
  },
  feedback: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const StudentFeedback = mongoose.model('StudentFeedback', TeacherFeedbackSchema);
export default StudentFeedback;
