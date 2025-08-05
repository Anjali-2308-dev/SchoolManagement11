import express from 'express';
const router = express.Router();
import StudentFeedback from '../models/studentFeedback.js';

// POST /studentfeedback
router.post('/', async (req, res) => {
  try {
    const { teacher, feedback, rating } = req.body;

    if (!teacher || !feedback || !rating) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new StudentFeedback({ teacher, feedback, rating });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (err) {
    console.error('Error saving feedback:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
