export interface User {
  $loki?: number;
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'owner' | 'seeker';
}

export interface Book {
  $loki?: number;
  title: string;
  author: string;
  genre: string;
  city: string;
  contact: string;
  description: string;
  ownerId: number;
  status: 'available' | 'rented' | 'exchanged';
  coverImage?: string;
  createdAt: Date;
}

// Extending Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
