import express from 'express';
import {
  createBook,
  getAllBooks,
  searchBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBookStats
} from '../controllers/bookController.js';
import { validateBook, validateBookUpdate } from '../middlewares/validateBook.js';

const router = express.Router();

// @route   GET /api/books/stats
// @desc    Get books statistics
// @access  Public
router.get('/stats', getBookStats);

// @route   GET /api/books/search
// @desc    Search books by title or author
// @access  Public
// Note: This route must come before /:id route to avoid conflicts
router.get('/search', searchBooks);

// @route   POST /api/books
// @desc    Create a new book
// @access  Public
router.post('/', validateBook, createBook);

// @route   GET /api/books
// @desc    Get all books with optional filtering and pagination
// @access  Public
router.get('/', getAllBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   PUT /api/books/:id
// @desc    Update book by ID
// @access  Public
router.put('/:id', validateBookUpdate, updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book by ID
// @access  Public
router.delete('/:id', deleteBook);

export default router;
