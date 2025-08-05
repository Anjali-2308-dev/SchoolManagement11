import express from 'express';
import Timetable from "../models/AddTimetable.js"
// Adjust the path as necessary
// import mongoose from 'mongoose'; // Uncomment if needed for other parts of the code  
const router = express.Router();


// POST: Save or update timetable
router.post('/', async (req, res) => {
  const { className, section, academicYear, entries } = req.body;

  if (!className || !section || !academicYear || !entries) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await Timetable.findOne({ className, section, academicYear });

    if (existing) {
      existing.entries = entries;
      await existing.save();
      return res.json({ message: 'Timetable updated', data: existing });
    }

    const timetable = new Timetable({ className, section, academicYear, entries });
    await timetable.save();
    res.status(201).json({ message: 'Timetable created', data: timetable });
  } catch (err) {
    console.error('Error saving timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:className', async (req, res) => {
  const { className } = req.params;

  try {
    const timetable = await Timetable.findOne({ className });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ data: timetable });
  } catch (err) {
    console.error('Error fetching timetable:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

