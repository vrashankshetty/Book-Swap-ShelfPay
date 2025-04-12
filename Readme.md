# 📚 Peer-to-Peer Book Exchange Portal

A full-stack web application that connects book owners with book seekers for renting, exchanging, or giving away books.

## 🚀 Features

### Core Features
- **User Profiles (Owners + Seekers)**
  - Distinct user types with role-based access
  - Complete profile management
  - Secure password handling

- **Book Listing Interface**
  - Book owners can create, edit, and delete listings
  - All users can browse available books
  - Detailed book information display

- **Authentication**
  - Email and password-based login
  - Role-based redirects to appropriate dashboards

### Bonus Features Implemented
- ✅ Edit/delete functionality for book listings
- ✅ Filter listings by genre and location
- ✅ Book cover image upload and storage
- ✅ Infinite scroll optimization for better performance

## 🛠️ Tech Stack

- **Frontend**: React + Next.js
- **Backend**: Node.js + Express
- **Storage**: In-memory with JSON file persistence (Loki.js)
- **Image Storage**: AWS S3 (for book cover images)

## 📋 Installation and Setup

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm i

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm i

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```
PORT=8080
NODE_ENV=development
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 📱 Application Flow

1. **User Registration/Login**
   - New users can register as either Book Owners or Book Seekers
   - Existing users can login with email and password

2. **Book Owner Flow**
   - List new books with title, author, genre, location, and contact info
   - Upload book cover images
   - Manage (edit/delete) existing listings
   - Browse available books from other owners

3. **Book Seeker Flow**
   - Browse all available book listings
   - Filter books by title, genre, or location
   - Contact book owners directly through provided contact information

## 🧠 AI Tools Used

- **Claude AI** - Used for generating portions of the codebase and sample data
- **V0** - Used for designing some UI components

## 🧪 What's Working

- ✅ Complete user authentication flow
- ✅ Book listing creation, editing, and deletion
- ✅ Image upload to AWS S3
- ✅ Filtering and searching functionality
- ✅ Responsive design for various device sizes
- ✅ Infinite scroll optimization

## 🚧 Future Improvements

While all required features have been implemented, future enhancements could include:

- Real-time chat between owners and seekers
- Formal booking/reservation system
- User ratings and reviews
- Geographic proximity search
- Social media sharing
- Enhanced security measures

