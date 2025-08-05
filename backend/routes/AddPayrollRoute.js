import express from 'express';
import { Payroll } from '../models/Payroll.js';

const router = express.Router();

// Create Payroll Entry
router.post('/', async (req, res) => {
  try {
    const { name, position, department, baseSalary, allowances, deductions, status } = req.body;
    if (!name || !position || !department || baseSalary == null || allowances == null || deductions == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const netSalary = baseSalary + allowances - deductions;
    const newEntry = new Payroll({
      name,
      position,
      department,
      baseSalary,
      allowances,
      deductions,
      netSalary,
      status: status || 'Pending'
    });

    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Payrolls
router.get('/', async (req, res) => {
  try {
    const entries = await Payroll.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Payroll Entry
router.put('/:id', async (req, res) => {
  try {
    const { name, position, department, baseSalary, allowances, deductions, status } = req.body;

    const netSalary = baseSalary + allowances - deductions;

    const updated = await Payroll.findByIdAndUpdate(
      req.params.id,
      { name, position, department, baseSalary, allowances, deductions, netSalary, status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Payroll not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Payroll Entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Payroll.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Payroll not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
