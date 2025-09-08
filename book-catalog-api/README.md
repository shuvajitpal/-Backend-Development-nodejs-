# Book Catalog API

A RESTful API for managing a book catalog built with Node.js, Express.js, and MongoDB using Mongoose ODM. This API provides complete CRUD operations for books along with search functionality.

## Features

- ✅ Complete CRUD operations for books
- 🔍 Search functionality by title or author (case-insensitive)
- 📊 Pagination support for all list endpoints
- 📈 Statistics endpoint for book analytics
- 🛡️ Input validation and error handling
- 📝 Request logging middleware
- 🏗️ Clean architecture with proper separation of concerns
- 🔧 ES Modules (import/export) syntax throughout

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Module System**: ES Modules (import/export)

## Project Structure

```
book-catalog-api/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   └── bookController.js      # CRUD + search logic
├── middlewares/
│   ├── errorHandler.js        # Custom error handler
│   ├── logger.js              # Simple request logger
│   └── validateBook.js        # Input validation middleware
├── models/
│   └── Book.js                # Mongoose schema/model
├── routes/
│   └── bookRoutes.js          # API routes
├── utils/
│   ├── asyncHandler.js        # Wrap async route handlers
│   └── responseFormatter.js   # Format API responses
├── server.js                  # Entry point
├── package.json
└── README.md
```

## Installation and Setup

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**
   - Make sure MongoDB is installed and running on your system
   - Default connection: `mongodb://localhost:27017/book_catalog`
   - Or set environment variable: `MONGODB_URI=your_mongodb_connection_string`

4. **Start the server:**
   ```bash
   npm start
   ```
   The server will start on port 3000 (or the port specified in `PORT` environment variable).

## API Endpoints

### Base URL
```
http://localhost:3000/api/books
```

### Book Schema
```json
{
  "title": "string (required, max 200 chars)",
  "author": "string (required, max 100 chars)", 
  "genre": "string (required, max 50 chars)",
  "publicationYear": "number (required, 1000-current year)",
  "availability": "boolean (default: true)"
}
```

### Endpoints

#### 1. Create a Book
- **POST** `/api/books`
- **Body:**
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "publicationYear": 1925,
    "availability": true
  }
  ```

#### 2. Get All Books
- **GET** `/api/books`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `genre` (optional): Filter by genre (case-insensitive)
  - `availability` (optional): Filter by availability (true/false)

#### 3. Search Books
- **GET** `/api/books/search?q=keyword`
- **Query Parameters:**
  - `q` (required): Search keyword for title or author
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

#### 4. Get Single Book
- **GET** `/api/books/:id`

#### 5. Update a Book
- **PUT** `/api/books/:id`
- **Body:** (any combination of book fields)
  ```json
  {
    "title": "Updated Title",
    "availability": false
  }
  ```

#### 6. Delete a Book
- **DELETE** `/api/books/:id`

#### 7. Get Book Statistics
- **GET** `/api/books/stats`
- Returns statistics about the book collection

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Description of the operation",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": {
    // Additional error details (optional)
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Retrieved 10 books",
  "data": {
    "books": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalBooks": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Example API Calls

### Create a Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell", 
    "genre": "Dystopian Fiction",
    "publicationYear": 1949
  }'
```

### Search Books
```bash
curl "http://localhost:3000/api/books/search?q=orwell&page=1&limit=5"
```

### Get Books by Genre
```bash
curl "http://localhost:3000/api/books?genre=fiction&page=1&limit=10"
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid MongoDB ObjectIds
- Validation errors
- Duplicate key errors
- Cast errors
- General server errors

## Validation Rules

- **title**: Required, non-empty, max 200 characters
- **author**: Required, non-empty, max 100 characters
- **genre**: Required, non-empty, max 50 characters
- **publicationYear**: Required, number between 1000 and current year
- **availability**: Optional boolean (default: true)

## Development Notes

- Uses ES Modules (import/export) syntax throughout
- No external logging library (custom logger middleware)
- No dotenv dependency (uses plain process.env)
- MongoDB connection string can be hardcoded or set via environment variable
- Text search indexes are created on title and author fields for optimized searching

## Contributing

1. Follow the existing code structure and naming conventions
2. Ensure all new endpoints follow the response format standards
3. Add appropriate validation and error handling
4. Test all endpoints thoroughly before submitting changes

## License

ISC
