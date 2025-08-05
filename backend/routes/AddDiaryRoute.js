import express from 'express';
import AddDiary from '../models/AddDiary.js';

const router = express.Router();

// Create Diary Entry
router.post("/", async (req, res) => {
  const { date, class: studentClass, subject, notes } = req.body;

  if (!date || !studentClass || !subject || !notes) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newDiaryEntry = new AddDiary({
      date,
      class: studentClass,
      subject,
      notes
    });

    const savedEntry = await newDiaryEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add diary entry' });
  }
});

// Get All Diary Entries
router.get("/", async (req, res) => {
  try {
    const entries = await AddDiary.find();
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
});

// Update Diary Entry
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { date, class: studentClass, subject, notes } = req.body;

  try {
    const updated = await AddDiary.findByIdAndUpdate(
      id,
      { date, class: studentClass, subject, notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update diary entry' });
  }
});

// Delete Diary Entry
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AddDiary.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ message: 'Diary entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete diary entry' });
  }
});

export default router;
