import express from 'express';
import Report from '../models/AddGrade.js';

const router = express.Router();

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// GET students by class name
router.get('/:className', async (req, res) => {
  try {
    const students = await Report.find({ class: req.params.className });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ADD a student
router.post('/', async (req, res) => {
  try {
    const {
      name,
      rollNo,
      class: className,
      math = 0,
      english = 0,
      science = 0,
      socialStudies = 0,
      computer = 0,
      hindi = 0,
    } = req.body;

    const marks = [math, english, science, socialStudies, computer, hindi].map(Number);
    const average = Math.round(marks.reduce((a, b) => a + b, 0) / marks.length);

    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';
    else if (average >= 40) grade = 'D';

    const newStudent = await Report.create({
      name,
      rollNo,
      class: className,
      math,
      english,
      science,
      socialStudies,
      computer,
      hindi,
      totalMarks,
      average,
      grade,
    });

    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// UPDATE a student
router.put('/:id', async (req, res) => {
  try {
    const {
      math = 0,
      english = 0,
      science = 0,
      socialStudies = 0,
      computer = 0,
      hindi = 0,
    } = req.body;

    const marks = [math, english, science, socialStudies, computer, hindi].map(Number);
    const average = Math.round(marks.reduce((a, b) => a + b, 0) / marks.length);

    let grade = 'F';
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B+';
    else if (average >= 60) grade = 'B';
    else if (average >= 50) grade = 'C';
    else if (average >= 40) grade = 'D';

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      {
        math,
        english,
        science,
        socialStudies,
        computer,
        hindi,
        totalMarks,
        average,
        grade,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete student' });
  }
});

export default router;
