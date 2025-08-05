import express from 'express';
import TeacherFeedback from '../models/AddFeedback.js'; // Import the TeacherFeedback model
const router = express.Router();


// GET all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await TeacherFeedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new feedback
router.post('/', async (req, res) => {
  const { class: cls, subject, type, feedback, rating } = req.body;

  if (!cls || !subject || !type || !feedback || !rating) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newFeedback = new TeacherFeedback({
    date: new Date().toISOString().split('T')[0],
    class: cls,
    subject,
    type,
    feedback,
    rating,
    status: 'Submitted',
  });

  try {
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT to update status (optional)
router.put('/:id', async (req, res) => {
  try {
    const feedback = await TeacherFeedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found.' });

    if (req.body.status) feedback.status = req.body.status;
    const updated = await feedback.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE feedback (optional)
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await TeacherFeedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found.' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;