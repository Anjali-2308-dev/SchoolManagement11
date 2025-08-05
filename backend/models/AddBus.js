
import mongoose from 'mongoose';

const BusEntrySchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },         // e.g. "BUS001"
  routeName: { type: String, required: true },                   // e.g. "Route A - Downtown"
  currentStop: { type: String, required: true },                 // e.g. "Main Street"
  eta: { type: String, required: true },                         // e.g. "8:15 AM" or "Arrived"
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Arrived'],
    default: 'On Time',
  },

  driver: {
    name: { type: String, required: true },                      // e.g. "Robert Johnson"
    license: { type: String, required: true },                   // e.g. "DL001234"
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },

  routePerformance: {
    onTimeRate: { type: Number, default: 0 },                    // e.g. 95
    rating: { type: String, enum: ['Excellent', 'Good', 'Average'], default: 'Good' },
  },

  totalStudents: { type: Number, default: 0 },                   // e.g. 116
});

const AddBus =mongoose.model("AddBus",BusEntrySchema)
export default AddBus;