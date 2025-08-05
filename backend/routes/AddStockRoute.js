import express from 'express';
import AddStock from "../models/AddStock.js" // make sure model filename and export match

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { item, category, quantity, minStock, status, vendor } = req.body;

    if (!item || !category || !quantity || !minStock || !status || !vendor) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newStock = new AddStock({
      item,
      category,
      quantity,
      minStock,
      status,
      vendor
    });

    const savedStock = await newStock.save();
    console.log('Saved stock:', savedStock);
    res.status(201).json(savedStock);
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const items = await AddStock.find();
    res.json(items);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await AddStock.findByIdAndUpdate(
      req.params.id,
      {
        item: req.body.item,
        category: req.body.category,
        quantity: req.body.quantity,
        minStock: req.body.minStock,
        status: req.body.status,
        vendor: req.body.vendor
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await AddStock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully', item: deleted });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});



export default router;

   