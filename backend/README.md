# P2P Book Exchange Portal Backend

A TypeScript Node.js backend for a Peer-to-Peer Book Exchange Portal. This project allows users to share, exchange, and rent books with others.

## Features

- User authentication (register/login)
- Two types of users: Book Owners and Book Seekers
- Book listing management (CRUD operations)
- Filtering books by title, genre, and location
- Toggle book status (available/rented/exchanged)

## Tech Stack

- Node.js
- TypeScript
- Express
- LokiJS (in-memory database with persistence)

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Start the server:
   ```
   npm start
   ```

   For development with hot reloading:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user

### User Profile
- GET `/api/users/profile` - Get user profile (requires auth)
- PUT `/api/users/profile` - Update user profile (requires auth)

### Book Management
- GET `/api/books` - Get all books (with optional filtering)
- GET `/api/books/:id` - Get a specific book by ID
- POST `/api/books` - Add a new book (requires owner role)
- PUT `/api/books/:id` - Update a book (requires ownership)
- DELETE `/api/books/:id` - Delete a book (requires ownership)
- PATCH `/api/books/:id/status` - Toggle book status (requires ownership)

## Authentication

For simplicity, this project uses a basic authentication mechanism:

1. When a user logs in, the API returns user information including the user ID
2. For authenticated requests, the client must include the following headers:
   - `email`: The user's email address
   - `userid`: The user's ID returned from login

## Data Models

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'owner' | 'seeker';
}
```

### Book
```typescript
{
  title: string;
  author: string;
  genre?: string;
  city: string;
  contact: string;
  ownerId: number;
  status: 'available' | 'rented' | 'exchanged';
  coverImage?: string;
}
```

## Bonus Features Implemented

- Edit/delete book listings
- Filter listings by Genre/Location
- Search by title

## What's Working

- Complete user authentication flow
- Book listing CRUD operations
- Filtering and searching
- Role-based access control
- Data validation
- In-memory database with sample data

## What's Not Implemented

- Image upload for book covers (placeholder structure is there)
- Front-end integration

## Future Improvements

- Add JWT authentication
- Add database persistence with MongoDB/PostgreSQL
- Implement proper error handling middleware
- Add unit and integration tests
- Add book cover image upload functionality
