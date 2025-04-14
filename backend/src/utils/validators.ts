import { User, Book, Request } from '../types';

export const validateUserInput = (user: Partial<User>): string[] => {
  const errors: string[] = [];
  
  if (!user.name || user.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!user.email || !user.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }
  
  if (!user.password || user.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!user.mobile || !user.mobile.match(/^\d{10}$/)) {
    errors.push('Valid 10-digit mobile number is required');
  }
  
  if (!user.role || !['owner', 'seeker'].includes(user.role)) {
    errors.push('Role must be either "owner" or "seeker"');
  }
  
  return errors;
};

export const validateBookInput = (book: Partial<Book>): string[] => {
  const errors: string[] = [];
  
  if (!book.title || book.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!book.author || book.author.trim() === '') {
    errors.push('Author is required');
  }
  
  if (!book.city || book.city.trim() === '') {
    errors.push('City/Location is required');
  }
  
  if (!book.contact || book.contact.trim() === '') {
    errors.push('Contact information is required');
  }
  
  return errors;
};

export const validateRequestInput = (request: Partial<Request>): string[] => {
  const errors: string[] = [];
  
  if (!request.title || request.title.trim() === '') {
    errors.push('Title is required');
  }
  
  return errors;
};

