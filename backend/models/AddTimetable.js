import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  entries: {
    type: Map,
    of: [String], // Each day's value is an array of subjects for each timeslot
    required: true,
  },
}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
