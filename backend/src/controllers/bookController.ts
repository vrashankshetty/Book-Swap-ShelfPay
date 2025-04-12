import { Request, Response } from 'express';
import { getBooks, getUsers } from '../db/database';
import { validateBookInput } from '../utils/validators';
import { Book } from '../types';
import { uploadFileToS3 } from '../utils/s3';

// Add a new book listing
export const addBook = async(req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user
    const { title, author, genre, city, contact,description } = req.body;
    console.log("Input data:", req.body);
    // Validate book input
    const bookData: Partial<Book> = {
      title,
      author,
      genre,
      city,
      description,
      contact: contact,
      ownerId: user?.$loki,
      status: 'available',
      createdAt: new Date(),
    };
    
    const validationErrors = validateBookInput(bookData);
    
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        errors: validationErrors
      });
      return;
    }
    
    // Add new book
    const books = getBooks();
    const file = req.file;
    console.log("File data:", file);
    let coverImage=null;
    if (file){
      const uploadRes = await uploadFileToS3(file as Express.Multer.File);
      if(!uploadRes.success){
        res.status(500).json({
          success: false,
          message: 'Error uploading file'
        });
        return;
      } 
     coverImage = uploadRes.url;
    }
   
    bookData.coverImage = coverImage??"https://shelfpay99.s3.ap-south-1.amazonaws.com/shelfpaylogo.png";
    const newBook = books.insert(bookData as Book) as Book;
    res.status(201).json({
      success: true,
      book: {
        ...newBook,
        id: newBook.$loki
      }
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding book'
    });
  }
};

// Get all books
export const getAllBooks = (req: Request, res: Response): void => {
  try {
    const books = getBooks();
    const allBooks = books.find();
    
    // Get query parameters for filtering and pagination
    const title = req.query.title as string;
    const city = req.query.city as string;
    const genre = req.query.genre as string;
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string || '0');
    const limit = parseInt(req.query.limit as string || '8');
    
    // Apply filters if provided
    let filteredBooks = allBooks;
    
    if (title) {
        const lowerTitle = title.toLowerCase();
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(lowerTitle) ||
          book.author?.toLowerCase().includes(lowerTitle)
        );
    }
    
    if (city) {
      filteredBooks = filteredBooks.filter(book => 
        book.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }
    
    if (status) {
      filteredBooks = filteredBooks.filter(book => 
        book.status?.toLowerCase().includes(status.toLowerCase())
      );
    }
    // Get total count before pagination
    const totalCount = filteredBooks.length;
    
    // Apply pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    // Format the response
    const formattedBooks = paginatedBooks.map(book => ({
      ...book,
      id: book.$loki
    }));
    
    res.status(200).json({
      success: true,
      books: formattedBooks,
      cities: Array.from(new Set(allBooks.map((book) => book.city))),
      genres: Array.from(new Set(allBooks.map((book) => book.genre))),
      total: totalCount,
      page,
      limit,
      hasMore: endIndex < totalCount
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving books'
    });
  }
};



export const getAllMyBooks = (req: Request, res: Response): void => {
  try {
    const user = req.user;
    const books = getBooks();
    const allBooks = books.find({ ownerId: user?.$loki });
    // Get query parameters for filtering and pagination
    const title = req.query.title as string;
    const city = req.query.city as string;
    const genre = req.query.genre as string;
    const status = req.query.status as string;
    const page = parseInt(req.query.page as string || '0');
    const limit = parseInt(req.query.limit as string || '8');
    
    // Apply filters if provided
    let filteredBooks = allBooks;
    
    if (title) {
      const lowerTitle = title.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(lowerTitle) ||
        book.author?.toLowerCase().includes(lowerTitle)
      );
    }
    
    if (city) {
      filteredBooks = filteredBooks.filter(book => 
        book.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    if (genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (status) {
      filteredBooks = filteredBooks.filter(book => 
        book.status?.toLowerCase().includes(status.toLowerCase())
      );
    }
    
    // Get total count before pagination
    const totalCount = filteredBooks.length;
    
    // Apply pagination
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    // Format the response
    const formattedBooks = paginatedBooks.map(book => ({
      ...book,
      id: book.$loki
    }));
    
    res.status(200).json({
      success: true,
      books: formattedBooks,
      cities: Array.from(new Set(allBooks.map((book) => book.city))),
      genres: Array.from(new Set(allBooks.map((book) => book.genre))),
      total: totalCount,
      page,
      limit,
      hasMore: endIndex < totalCount
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving books'
    });
  }
};


export const getRecentBooks = (req: Request, res: Response): void => {
  try {
    const user = req.user;
    const books = getBooks();
    const recentBooks = books.chain().simplesort("createdAt", true).limit(4).data();
    

    res.status(200).json({
      success: true,
      books: recentBooks
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving books'
    });
  }
};

export const getBookById = (req: Request, res: Response): void => {
  try {
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
      return;
    }
    
    const books = getBooks();
    const book = books.findOne({ $loki: bookId });
    
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      return;
    }
    const users = getUsers();
    const user = users.findOne({ $loki: book.ownerId });
    res.status(200).json({
      success: true,
      book: {
        ...book,
        id: book.$loki,
        user:{
          name: user?.name,
          mobile: user?.mobile,
          email: user?.email,
        },
      }
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving book'
    });
  }
};

// Update book
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
      return;
    }
    
    const books = getBooks();
    const book = books.findOne({ $loki: bookId });
    
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      return;
    }
    
    // Check if user is the owner of the book
    if (book.ownerId !== req.user.$loki) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own book listings'
      });
      return;
    }
    
    const { title, author, genre, city, contact, status,description } = req.body;
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (city) book.city = city;
    if (contact) book.contact = contact;
    if (description) book.description = description;

    if (status && ['available', 'rented', 'exchanged'].includes(status)) {
      book.status = status;
    }
    const file = req.file;
    let coverImage=null;
    if (file){
      const uploadRes = await uploadFileToS3(file as Express.Multer.File);
      if(!uploadRes.success){
        res.status(500).json({
          success: false,
          message: 'Error uploading file'
        });
        return;
      } 
     coverImage = uploadRes.url;
    }
    if (coverImage) book.coverImage = coverImage;
    console.log("Book data before update:", book);
    books.update(book);
    console.log("Book data after update:");
    res.status(200).json({
      success: true,
      book: {
        ...book,
        id: book.$loki
      },
      message: 'Book updated successfully'
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book'
    });
  }
};

// Delete book
export const deleteBook = (req: Request, res: Response): void => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
      return;
    }
    
    const books = getBooks();
    const book = books.findOne({ $loki: bookId });
    
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      return;
    }
    
    // Check if user is the owner of the book
    if (book.ownerId !== req.user.$loki) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own book listings'
      });
      return;
    }
    
    books.remove(book);
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
};

// Toggle book status
export const toggleBookStatus = (req: Request, res: Response): void => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const bookId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (isNaN(bookId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
      return;
    }
    
    if (!status || !['available', 'rented', 'exchanged'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: available, rented, exchanged'
      });
      return;
    }
    
    const books = getBooks();
    const book = books.findOne({ $loki: bookId });
    
    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      });
      return;
    }
    
    
    book.status = status as 'available' | 'rented' | 'exchanged';
    books.update(book);
    
    res.status(200).json({
      success: true,
      book: {
        ...book,
        id: book.$loki
      },
      message: `Book status updated to ${status}`
    });
  } catch (error) {
    console.error('Toggle book status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating book status'
    });
  }
};
