import express from 'express';
import { connectDB } from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import { logger } from '../src/middlewares/logger.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Book Catalog API is running!',
    version: '1.0.0'
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
