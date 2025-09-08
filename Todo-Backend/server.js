import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to DB
await connectDB();

// Routes
app.use("/api/todos", todoRoutes);

app.get("/", (req, res) => {
  res.send("Todo Backend with MongoDB is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// This file sets up the Express server, connects to the MongoDB database, and defines the routes for the Todo application. It also includes middleware for parsing JSON requests and a simple root route.