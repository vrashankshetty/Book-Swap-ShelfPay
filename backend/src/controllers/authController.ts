import { Request, Response } from 'express';
import { getUsers } from '../db/database';
import { validateUserInput } from '../utils/validators';
import { User } from '../types';

// Register a new user
export const register = (req: Request, res: Response): void => {
  try {
    const { name, email, password, mobile, role } = req.body;
    
    // Validate user input
    const user: Partial<User> = { 
      name, 
      email, 
      password, 
      mobile, 
      role: role.toLowerCase() as 'owner' | 'seeker' 
    };
    
    const validationErrors = validateUserInput(user);
    
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        errors: validationErrors
      });
      return;
    }
    
    // Check if user already exists
    const users = getUsers();
    const existingUser = users.findOne({ email });
    
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
      return;
    }
    
    // Create new user
    const newUser:User = users.insert(user as User) as User;
    
    // Remove password from response
    const { password:_, ...userResponse } = newUser;
    
    res.status(201).json({
      success: true,
      user: {
        ...userResponse,
        id: newUser.$loki
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// Login user
export const login = (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }
    
    const users = getUsers();
    const user = users.findOne({ email });
    
    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.status(200).json({
      success: true,
      user: {
        ...userResponse,
        id: user.$loki
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};


export const verifyToken = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;  
    const users = getUsers();
    const user = users.findOne({ $loki: parseInt(id) });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }
    
    const { password: _, ...userResponse } = user;
    
    res.status(200).json({
      success: true,
      user: {
        ...userResponse,
        id: user.$loki
      }
    });
  } catch (error) {
    console.error('VerifyToken error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verify token'
    });
  }
};
