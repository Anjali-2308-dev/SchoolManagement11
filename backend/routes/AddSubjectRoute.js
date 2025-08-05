// backend/routes/subjectRoutes.js
import express from 'express';
import Subject from '../models/AddSubject.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const saved = await new Subject(req.body).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// backend/routes/subjectRoutes.js

router.get('/', async (req, res) => {
  try {
    const { className } = req.query;
    const filter = className ? { className } : {};
    const subjects = await Subject.find(filter);
    res.json(subjects);
  } catch {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
