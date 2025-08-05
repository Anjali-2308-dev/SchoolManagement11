import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // Use string for easier date handling
  present: { type: Boolean, default: true },
});

attendanceSchema.index({ student: 1, date: 1 }, { unique: true }); // Prevent duplicate entries


const Attendance =mongoose.model('Attendance',attendanceSchema)
export default Attendance;