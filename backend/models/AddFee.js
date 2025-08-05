// models/Fee.js
import mongoose from 'mongoose';
const feeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // student ID
  name: { type: String, required: true }, // student name
  class: { type: String, required: true }, // e.g., Grade 1
  amount: { type: String, required: true }, // e.g., ₹12,000
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], required: true },
  date: { type: String, required: true }, // can be Date type too
  remarks: { type: String, default: '' }
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
