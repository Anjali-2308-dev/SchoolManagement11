// routes/videos.js
import express from 'express';
import Video from '../models/AddVideo.js';

const router = express.Router();

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST a new video
router.post('/', async (req, res) => {
  try {
    const { title, subject, url } = req.body;
    const newVideo = await Video.create({
      title,
      subject,
      url,
      thumbnail: '/placeholder.svg',
      uploadDate: new Date().toISOString().split('T')[0],
    });
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add video' });
  }
});

// PUT update a video
router.put('/:id', async (req, res) => {
  try {
    const { title, subject, url } = req.body;
    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { title, subject, url },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update video' });
  }
});

// DELETE a video
router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete video' });
  }
});

export default router;
