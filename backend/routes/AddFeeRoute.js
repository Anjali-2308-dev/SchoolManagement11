// routes/feeRoutes.js
import express from 'express';
import Fee from '../models/AddFee.js';
const router = express.Router();


// GET all fee records
router.get('/', async (req, res) => {
  try {
    const records = await Fee.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching fees' });
  }
});

router.get('/student', async (req, res) => {
  try {
    const records = await Fee.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student-wise fees' });
  }
});

// GET class-wise aggregated data
router.get('/class', async (req, res) => {
  try {
    // Aggregate by class with counts and sums
    const classData = await Fee.aggregate([
      {
        $group: {
          _id: "$class",
          totalStudents: { $sum: 1 },
          collected: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid"] }, { $toDouble: "$amount" }, 0]
            }
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, { $toDouble: "$amount" }, 0]
            }
          },
          overdue: {
            $sum: {
              $cond: [{ $eq: ["$status", "Overdue"] }, { $toDouble: "$amount" }, 0]
            }
          }
        }
      },
      {
        $addFields: {
          percentage: {
            $cond: [
              { $eq: ["$totalStudents", 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: ["$collected", { $add: ["$collected", "$pending", "$overdue"] }]
                  },
                  100
                ]
              }
            ]
          }
        }
      },
      {
        $project: {
          class: "$_id",
          totalStudents: 1,
          collected: { $round: ["$collected", 2] },
          pending: { $round: ["$pending", 2] },
          overdue: { $round: ["$overdue", 2] },
          percentage: { $round: ["$percentage", 1] },
          _id: 0
        }
      }
    ]);

    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching class-wise fees' });
  }
});

// POST new fee record
router.post('/', async (req, res) => {
  try {
    const newRecord = new Fee(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ error: 'Error creating fee record', details: err.message });
  }
});

// PUT update fee record
router.put('/:id', async (req, res) => {
  try {
    const updated = await Fee.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Record not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating record' });
  }
});

// DELETE a record by student ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Fee.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting record' });
  }
});

export default router;
