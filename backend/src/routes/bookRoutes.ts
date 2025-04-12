import express from 'express';
import { 
  addBook, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook,
  toggleBookStatus,
  getAllMyBooks,
  getRecentBooks
} from '../controllers/bookController';
import { authMiddleware, isOwner } from '../middleware/authMiddleware';
import multer from 'multer';




const upload = multer();
const router = express.Router();


// Protected routes
router.post('/', authMiddleware, isOwner,upload.single('coverImage'),addBook);
router.get('/me', authMiddleware, getAllMyBooks);
router.put('/:id', authMiddleware,upload.single('coverImage'),updateBook);
router.delete('/:id', authMiddleware, deleteBook);
router.patch('/:id/status', authMiddleware, toggleBookStatus);


// Public routes
router.get('/', getAllBooks);
router.get('/recent-books', getRecentBooks);
router.get('/:id', getBookById);



export default router;
