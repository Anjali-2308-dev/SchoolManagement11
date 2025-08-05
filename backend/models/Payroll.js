// models/Payroll.js
import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  allowances: {
    type: Number,
    required: true
  },
  deductions: {
    type: Number,
    required: true
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'On Hold'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

export const Payroll = mongoose.model('Payroll', PayrollSchema);