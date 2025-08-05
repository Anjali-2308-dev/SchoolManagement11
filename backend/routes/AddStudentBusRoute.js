
import express from 'express';
import Student from '../models/AddStudentBus.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const { studentName, class: studentClass, busId, pickupPoint, vehicle } = req.body;

    if (!studentName || !studentClass || !busId || !pickupPoint || !vehicle) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newStudent = new Student({
      studentName,
      class: studentClass,
      busId,
      pickupPoint,
      vehicle
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
