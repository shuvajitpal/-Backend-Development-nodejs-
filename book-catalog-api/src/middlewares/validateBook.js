import { errorResponse } from '../utils/responseFormatter.js';

// Validation middleware for book creation and updates
export const validateBook = (req, res, next) => {
  const { title, author, genre, publicationYear } = req.body;
  const errors = [];

  // Check for required fields
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  } else if (title.length > 200) {
    errors.push('Title cannot be more than 200 characters');
  }

  if (!author || author.trim() === '') {
    errors.push('Author is required');
  } else if (author.length > 100) {
    errors.push('Author name cannot be more than 100 characters');
  }

  if (!genre || genre.trim() === '') {
    errors.push('Genre is required');
  } else if (genre.length > 50) {
    errors.push('Genre cannot be more than 50 characters');
  }

  if (!publicationYear) {
    errors.push('Publication year is required');
  } else {
    const year = parseInt(publicationYear);
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      errors.push('Publication year must be a valid number');
    } else if (year < 1000 || year > currentYear) {
      errors.push(`Publication year must be between 1000 and ${currentYear}`);
    }
  }

  // Check if availability is provided and is boolean
  if (req.body.hasOwnProperty('availability') && typeof req.body.availability !== 'boolean') {
    errors.push('Availability must be a boolean value');
  }

  if (errors.length > 0) {
    return errorResponse(res, 400, 'Validation failed', { errors });
  }

  // Trim string fields
  req.body.title = title.trim();
  req.body.author = author.trim();
  req.body.genre = genre.trim();
  req.body.publicationYear = parseInt(publicationYear);

  next();
};

// Validation middleware for updates (allows partial updates)
export const validateBookUpdate = (req, res, next) => {
  const { title, author, genre, publicationYear } = req.body;
  const errors = [];

  // Only validate fields that are provided
  if (title !== undefined) {
    if (!title || title.trim() === '') {
      errors.push('Title cannot be empty');
    } else if (title.length > 200) {
      errors.push('Title cannot be more than 200 characters');
    } else {
      req.body.title = title.trim();
    }
  }

  if (author !== undefined) {
    if (!author || author.trim() === '') {
      errors.push('Author cannot be empty');
    } else if (author.length > 100) {
      errors.push('Author name cannot be more than 100 characters');
    } else {
      req.body.author = author.trim();
    }
  }

  if (genre !== undefined) {
    if (!genre || genre.trim() === '') {
      errors.push('Genre cannot be empty');
    } else if (genre.length > 50) {
      errors.push('Genre cannot be more than 50 characters');
    } else {
      req.body.genre = genre.trim();
    }
  }

  if (publicationYear !== undefined) {
    const year = parseInt(publicationYear);
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      errors.push('Publication year must be a valid number');
    } else if (year < 1000 || year > currentYear) {
      errors.push(`Publication year must be between 1000 and ${currentYear}`);
    } else {
      req.body.publicationYear = year;
    }
  }

  if (req.body.hasOwnProperty('availability') && typeof req.body.availability !== 'boolean') {
    errors.push('Availability must be a boolean value');
  }

  if (errors.length > 0) {
    return errorResponse(res, 400, 'Validation failed', { errors });
  }

  next();
};
