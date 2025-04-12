import { Request, Response } from 'express';
import { getBooks, getUsers } from '../db/database';
import { getBookById } from './bookController';
import { Book } from '../types';

// Get user profile
export const getUserProfile = (req: Request, res: Response): void => {
  try {
    // User is already available from auth middleware
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const { password, ...userWithoutPassword } = req.user;
    
    res.status(200).json({
      success: true,
      user: {
        ...userWithoutPassword,
        id: req.user.$loki
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile'
    });
  }
};


export const updateUserProfile = (req: Request, res: Response): void => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const { name, mobile } = req.body;
    const users = getUsers();
    const user = users.findOne({ $loki: req.user.$loki });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    
    users.update(user);
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      user: {
        ...userWithoutPassword,
        id: user.$loki
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
}

export const getMyDashboard = (req: Request, res: Response): void => {
    try {
      if (!req.user || !req.user.$loki) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const books = getBooks();
      const myBooks = books.find({ ownerId: req.user.$loki })
     
      const details = {
        totalBooks: myBooks.length,
        availableBooks: myBooks.filter((book: Book) => book.status === 'available').length,
        rentedBooks: myBooks.filter((book: Book) => book.status !== 'available').length,
        myBooks:myBooks.slice(0,4)
      }
 
      res.status(200).json({
        success: true,
        dashboard: details,
        message: 'Dashboard retrieved successfully'
      });

    } catch (error) {
      console.error('Fetching Dashboard', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching dashboard'
      });
    }
};
