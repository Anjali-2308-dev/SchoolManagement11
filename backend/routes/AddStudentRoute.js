import express from 'express';

import { AddStudent } from "../models/AddStudent.js";
const router = express.Router();


router.post('/Addstudent', async (req, res) => {
  try {
    const existingStudent = await AddStudent.findOne({ name: req.body.name });
    if (existingStudent) {
      return res.status(409).json({ error: 'Student with this Name already exists' });
    }
    const student = new AddStudent(req.body);
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving student:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;