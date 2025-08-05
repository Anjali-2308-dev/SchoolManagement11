import express from 'express';
import {AddStaff} from "../models/AddStaff.js" // make sure model filename and export match

const router = express.Router();



router.get('/', async (req, res) => {
  try { 
    const staffMembers = await AddStaff.find();
    console.log('Fetched staff members:', staffMembers);
    res.status(200).json(staffMembers);
  } catch (err) { 
    console.error('Fetch error:', err);
    res.status(500).json({ error: err.message });
  }
}); 

router.post('/', async (req, res) => {
  try {
    const { name, role, subjects, classes, joinDate, email, phone } = req.body;

    if (!name || !role || !subjects || !classes || !joinDate || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newStaff = new AddStaff({
      name,
      role,
      subjects,
      classes,
      joinDate,
      email,
      phone
    });

    const savedStaff = await newStaff.save();
    console.log('Saved staff:', savedStaff);
    res.status(201).json(savedStaff);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
