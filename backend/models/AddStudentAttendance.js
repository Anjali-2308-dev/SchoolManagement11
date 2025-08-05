import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
});


const StudentAttendance =mongoose.model('StudentAttendance',studentSchema)
export default StudentAttendance;
