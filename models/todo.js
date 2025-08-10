import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
// This file defines the Mongoose schema for the Todo model, including fields for title, completed status, and read status. It also includes timestamps for creation and updates.