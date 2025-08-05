// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  busId: {
    type: String,
    required: true
  },
  pickupPoint: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  }
}, { timestamps: true });

const AddStudentBus=mongoose.model("AddStudentBus",studentSchema)
export default AddStudentBus;
