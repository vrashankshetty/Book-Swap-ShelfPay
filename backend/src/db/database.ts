import loki from 'lokijs';
import { User, Book, Request } from '../types';


const db = new loki('db.json', {
  autoload: true,
  autoloadCallback: initializeDatabase,
  autosave: true,
  autosaveInterval: 5000
});

let users: Collection<User>;
let books: Collection<Book>;
let requests: Collection<Request>;


function initializeDatabase(): void {
  users = db.getCollection<User>('users') || db.addCollection<User>('users', { 
    unique: ['email'],
    indices: ['role']
  });
  
  books = db.getCollection<Book>('books') || db.addCollection<Book>('books', {
    indices: ['ownerId', 'title', 'city', 'genre']
  });
  
  requests = db.getCollection<Request>('requests') || db.addCollection<Request>('requests', {
    indices: ['userId', 'ownerId']
  });


  if (users.count() === 0) {
    users.insert([
      { 
        name: 'John Owner',
        email: 'owner@example.com',
        password: 'password123',
        mobile: '1234567890',
        role: 'owner'
      },
      { 
        name: 'Jane Seeker',
        email: 'seeker@example.com',
        password: 'password123',
        mobile: '0987654321',
        role: 'seeker'
      }
    ]);
    console.log('Sample users created');
  }
  
  if (books.count() === 0) {
    const johnId = users.findOne({ email: 'owner@example.com' })?.$loki;
    if (johnId) {
      books.insert([
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'fiction',
          description: 'A novel set in the 1920s about the American dream.',
          city: 'New York',
          coverImage: 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          genre: 'fiction',
          description: 'A novel about racial injustice in the Deep South.',
          city: 'Chicago',
          coverImage: 'https://covers.openlibrary.org/b/id/8225269-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: '1984',
          author: 'George Orwell',
          genre: 'sci-fi',
          description: 'A dystopian novel set in a totalitarian society.',
          city: 'London',
          coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          genre: 'fantasy',
          description: 'A fantasy novel about the journey of a hobbit.',
          city: 'Bristol',
          coverImage: 'https://covers.openlibrary.org/b/id/6979861-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Steve Jobs',
          author: 'Walter Isaacson',
          genre: 'biography',
          description: 'A biography of the visionary founder of Apple.',
          city: 'San Francisco',
          coverImage: 'https://covers.openlibrary.org/b/id/7444201-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Sapiens',
          author: 'Yuval Noah Harari',
          genre: 'history',
          description: 'A brief history of humankind.',
          city: 'Tel Aviv',
          coverImage: 'https://covers.openlibrary.org/b/id/8370082-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Power of Now',
          author: 'Eckhart Tolle',
          genre: 'self-help',
          description: 'A guide to spiritual enlightenment.',
          city: 'Berlin',
          coverImage: 'https://covers.openlibrary.org/b/id/6979680-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Da Vinci Code',
          author: 'Dan Brown',
          genre: 'mystery',
          description: 'A thrilling mystery novel involving secret societies.',
          city: 'Paris',
          coverImage: 'https://covers.openlibrary.org/b/id/7884866-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Atomic Habits',
          author: 'James Clear',
          genre: 'self-help',
          description: 'An easy and proven way to build good habits.',
          city: 'Los Angeles',
          coverImage: 'https://covers.openlibrary.org/b/id/10521959-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Educated',
          author: 'Tara Westover',
          genre: 'biography',
          description: 'A memoir about growing up in a survivalist family.',
          city: 'Denver',
          coverImage: 'https://covers.openlibrary.org/b/id/9354897-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Dune',
          author: 'Frank Herbert',
          genre: 'sci-fi',
          description: 'A science fiction epic set on a desert planet.',
          city: 'Las Vegas',
          coverImage: 'https://covers.openlibrary.org/b/id/8100928-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          genre: 'fiction',
          description: 'A novel about teenage alienation.',
          city: 'Boston',
          coverImage: 'https://covers.openlibrary.org/b/id/8221420-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Thinking, Fast and Slow',
          author: 'Daniel Kahneman',
          genre: 'non-fiction',
          description: 'A groundbreaking tour of the mind.',
          city: 'New Delhi',
          coverImage: 'https://covers.openlibrary.org/b/id/7235233-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'Becoming',
          author: 'Michelle Obama',
          genre: 'biography',
          description: 'A memoir by the former First Lady of the United States.',
          city: 'Washington, D.C.',
          coverImage: 'https://covers.openlibrary.org/b/id/9354031-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          genre: 'fiction',
          description: 'A journey of self-discovery and personal legend.',
          city: 'Madrid',
          coverImage: 'https://covers.openlibrary.org/b/id/8114151-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
        {
          title: 'The Subtle Art of Not Giving a F*ck',
          author: 'Mark Manson',
          genre: 'self-help',
          description: 'A counterintuitive approach to living a good life.',
          city: 'Austin',
          coverImage: 'https://covers.openlibrary.org/b/id/8401307-L.jpg',
          contact: 'owner@example.com',
          ownerId: johnId,
          status: 'available',
          createdAt: new Date(),
        },
      ]
      );
      console.log('Sample books created');
    }
  }
}

export const getUsers = (): Collection<User> => {
  if (!db.getCollection('users')) {
    throw new Error('Database not initialized properly');
  }
  return users;
};

export const getBooks = (): Collection<Book> => {
  if (!db.getCollection('books')) {
    throw new Error('Database not initialized properly');
  }
  return books;
};

export const getRequests = (): Collection<Request> => {
  if (!db.getCollection('requests')) {
    throw new Error('Database not initialized properly');
  }
  return requests;
};
