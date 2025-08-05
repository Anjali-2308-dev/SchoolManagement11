import express from 'express';
import path from 'path';
import fs from 'fs';
import Achievement from '../models/AddAchievements.js';
import uploadAchievement from '../Middlewares/AchieveUpload.js';

const router = express.Router();

// POST - Create Achievement
router.post('/', uploadAchievement.single('file'), async (req, res) => {
  try {
    const { student, title, category, date, description } = req.body;
    
    if (!student || !title || !category || !date || !description) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    const newAchievement = new Achievement({
      student,
      title,
      category,
      date,
      description,
      fileUrl: req.file ? `/uploads/achievements/${req.file.filename}` : null,
      fileType: req.file ? req.file.mimetype : null
    });

    await newAchievement.save();
    res.status(201).json(newAchievement);
  } catch (err) {
    console.error('Error creating achievement:', err);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlink(path.join(uploadDir, req.file.filename), (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create achievement',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET - Fetch All Achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.status(200).json(achievements);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch achievements',
      error: err.message 
    });
  }
});

// DELETE - Delete Achievement
router.delete('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ 
        message: 'Achievement not found' 
      });
    }

    // Delete associated file if exists
    if (achievement.fileUrl) {
      const filePath = path.join(process.cwd(), achievement.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
      message: 'Achievement deleted successfully' 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete achievement',
      error: err.message 
    });
  }
});

export default router;