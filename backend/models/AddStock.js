import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
    trim:true
  },
  category: {
      type: String,
      required: true,
      enum: ['Books', 'Stationery', 'Supplies', 'Science', 'Sports', 'Electronics'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    minStock: {
      type: Number,
      required: true,
      min: [0, 'Minimum stock cannot be negative'],
    },
    vendor: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Available', 'Low Stock', 'Out of Stock'],
      default: 'Available',
    },
  },
  {
    timestamps: true, 
  });

  const AddStock = mongoose.model('Stock', StockSchema);
  export default AddStock;

