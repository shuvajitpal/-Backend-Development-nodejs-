import Book from '../models/Book.js';
import { asyncHandler } from '../../src/utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';
import mongoose from 'mongoose';

// @desc    Create a new book
// @route   POST /api/books
// @access  Public
export const createBook = asyncHandler(async (req, res) => {
  const book = new Book(req.body);
  const savedBook = await book.save();

  successResponse(res, 201, 'Book created successfully', savedBook);
});

// @desc    Get all books
// @route   GET /api/books
// @access  Public
export const getAllBooks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, genre, availability } = req.query;

  // Build query object
  const query = {};

  if (genre) {
    query.genre = new RegExp(genre, 'i'); // Case-insensitive search
  }

  if (availability !== undefined) {
    query.availability = availability === 'true';
  }

  // Calculate skip value for pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get books with pagination
  const books = await Book.find(query)
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Book.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages,
    totalBooks: total,
    hasNext: parseInt(page) < totalPages,
    hasPrev: parseInt(page) > 1
  };

  if (books.length === 0) {
    return successResponse(res, 200, 'No books found', { books: [], pagination });
  }

  successResponse(res, 200, `Retrieved ${books.length} books`, { books, pagination });
});

// @desc    Search books by title or author
// @route   GET /api/books/search?q=keyword
// @access  Public
export const searchBooks = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q || q.trim() === '') {
    return errorResponse(res, 400, 'Search query parameter "q" is required');
  }

  const searchQuery = q.trim();

  // Create search criteria for title and author (case-insensitive)
  const searchCriteria = {
    $or: [
      { title: { $regex: searchQuery, $options: 'i' } },
      { author: { $regex: searchQuery, $options: 'i' } }
    ]
  };

  // Calculate skip value for pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Perform search with pagination
  const books = await Book.find(searchCriteria)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count for pagination
  const total = await Book.countDocuments(searchCriteria);
  const totalPages = Math.ceil(total / parseInt(limit));

  const pagination = {
    currentPage: parseInt(page),
    totalPages,
    totalResults: total,
    hasNext: parseInt(page) < totalPages,
    hasPrev: parseInt(page) > 1,
    searchQuery: searchQuery
  };

  if (books.length === 0) {
    return successResponse(res, 200, `No books found matching "${searchQuery}"`, { books: [], pagination });
  }

  successResponse(res, 200, `Found ${books.length} books matching "${searchQuery}"`, { books, pagination });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid book ID format');
  }

  const book = await Book.findById(id);

  if (!book) {
    return errorResponse(res, 404, 'Book not found');
  }

  successResponse(res, 200, 'Book retrieved successfully', book);
});

// @desc    Update book by ID
// @route   PUT /api/books/:id
// @access  Public
export const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid book ID format');
  }

  const book = await Book.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!book) {
    return errorResponse(res, 404, 'Book not found');
  }

  successResponse(res, 200, 'Book updated successfully', book);
});

// @desc    Delete book by ID
// @route   DELETE /api/books/:id
// @access  Public
export const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return errorResponse(res, 400, 'Invalid book ID format');
  }

  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    return errorResponse(res, 404, 'Book not found');
  }

  successResponse(res, 200, 'Book deleted successfully', { deletedBook: book });
});

// @desc    Get books statistics
// @route   GET /api/books/stats
// @access  Public
export const getBookStats = asyncHandler(async (req, res) => {
  const totalBooks = await Book.countDocuments();
  const availableBooks = await Book.countDocuments({ availability: true });
  const unavailableBooks = await Book.countDocuments({ availability: false });

  // Get genre distribution
  const genreStats = await Book.aggregate([
    { $group: { _id: '$genre', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get publication year range
  const yearStats = await Book.aggregate([
    {
      $group: {
        _id: null,
        minYear: { $min: '$publicationYear' },
        maxYear: { $max: '$publicationYear' },
        avgYear: { $avg: '$publicationYear' }
      }
    }
  ]);

  const stats = {
    totalBooks,
    availableBooks,
    unavailableBooks,
    genreDistribution: genreStats,
    yearRange: yearStats[0] || { minYear: null, maxYear: null, avgYear: null }
  };

  successResponse(res, 200, 'Book statistics retrieved successfully', stats);
});
