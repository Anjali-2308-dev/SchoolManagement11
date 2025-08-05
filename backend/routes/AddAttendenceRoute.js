import express from 'express'
const router = express.Router();
import Student from  '../models/AddStudentAttendance.js';
import Attendance  from '../models/AddAttendence.js';

// POST /attendance
router.post('/', async (req, res) => {
  try {
    const { name, rollNo, class: className, present } = req.body;

    if (!name || !rollNo || !className) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save student
    const student = new Student({ name, rollNo, class: className });
    await student.save();

    // Save today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendance = new Attendance({
      student: student._id,
      date: today,
      present,
    });
    await attendance.save();

    res.json({ ...student.toObject(), present });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Roll number already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/students-with-attendance', async (req, res) => {
  try {
    const { class: className, date } = req.query;

    if (!className || !date) {
      return res.status(400).json({ error: 'Missing class or date parameter' });
    }

    // 1. Get students of that class
    const students = await Student.find({ class: className });

    // 2. Get attendances for that date
    const attendances = await Attendance.find({ date }).populate('student');

    // 3. Create map: studentId -> present
    const attendanceMap = new Map();
    attendances.forEach((a) => {
      if (a.student?._id) {
        attendanceMap.set(a.student._id.toString(), a.present);
      }
    });

    // 4. Merge both: create unified array
    const result = students.map((s) => ({
      _id: s._id,
      name: s.name,
      rollNo: s.rollNo,
      class: s.class,
      present: attendanceMap.get(s._id.toString()) ?? true, // default to present
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error in /students-with-attendance:', error);
    return res.status(500).json({ error: 'Failed to fetch students with attendance' });
  }
});

// Update present/absent for a specific attendance record
router.put('/:studentId', async (req, res) => {
  const { present } = req.body;

  if (present === undefined) {
    return res.status(400).json({ message: 'Missing present value' });
  }

  try {
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        present,
        absent: !present
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('PUT Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
