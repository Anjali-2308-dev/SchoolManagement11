import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();  
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


export const Db = mongoose.connection;