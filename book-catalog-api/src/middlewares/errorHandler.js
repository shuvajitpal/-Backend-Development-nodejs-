import mongoose from 'mongoose';

// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return res.status(404).json({
      success: false,
      message: message
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      message: message
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message: message
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({
      success: false,
      message: message
    });
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return res.status(401).json({
      success: false,
      message: message
    });
  }

  // Default server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
