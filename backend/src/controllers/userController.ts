import { Request, Response } from 'express';
import { getBooks, getRequests, getUsers } from '../db/database';
import { getBookById } from './bookController';
import { Book,Request as TRequest } from '../types';
import { validateRequestInput } from '../utils/validators';

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

// router.get('/requests', authMiddleware, updateUserProfile);

export const getUserRequests = (req: Request, res: Response): void => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const requests = getRequests();
    const allReq = requests.find({userId:req.user.$loki})
   
    const formattedRequests = allReq.map((req:any) => ({
      ...req,
      id: req.$loki
    }));
    
  

    res.status(200).json({
      success: true,
      requests:formattedRequests,
      message: 'Requests retrieved successfully'
    });

  } catch (error) {
    console.error('Fetching Requests', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

// router.get('/requests/:id', authMiddleware, updateUserProfile);

export const getUserEachRequest = (req: Request, res: Response): void => {
  const requestId = parseInt(req.params.id);
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }


    const requests = getRequests();
    const myRequest = requests.findOne({ $loki: requestId })
    if (!myRequest) {
      res.status(404).json({
        success: false,
        message: 'Request not found'
      });
      return;
    }
    const users = getUsers();
    const owner = users.findOne({ $loki: myRequest?.ownerId });
    const user = users.findOne({ $loki: myRequest?.userId });
  
    const newRequest = {
      ...myRequest,
      id: myRequest?.$loki,
      canRespond:!myRequest.ownerId || (req.user.$loki === myRequest?.ownerId),
      owner:owner,
      user:user
    }
    res.status(200).json({
      success: true,
      request:newRequest,
      message: 'Request retrieved successfully'
    });

  } catch (error) {
    console.error('Fetching Request', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

// router.post('/requests', authMiddleware, updateUserProfile);

export const addRequest = async(req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user
    const { title,description  } = req.body;
    // Validate book input
    const reqData: Partial<TRequest> = {
      title,
      description,
      userId: user?.$loki,
      respond: false,
      response: "",
      createdAt: new Date(),
    };
    
    const validationErrors = validateRequestInput(reqData);
    
    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        errors: validationErrors
      });
      return;
    }
    
    // Add new book
    const requests = getRequests();
  
    const newReq = requests.insert(reqData as TRequest) as TRequest;
    res.status(201).json({
      success: true,
      request: {
        ...newReq,
        id: newReq.$loki
      }
    });
  } catch (error) {
    console.error('Add request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding request'
    });
  }
};



// router.delete('/requests/:id', authMiddleware, updateUserProfile);
export const deleteRequest = (req: Request, res: Response): void => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const requestId = parseInt(req.params.id);
    
    if (isNaN(requestId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid book ID'
      });
      return;
    }
    
    const requests = getRequests();
    const request = requests.findOne({ $loki: requestId });
    
    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Request not found'
      });
      return;
    }
    
    // Check if user is the owner of the book
    if (request.userId !== req.user.$loki) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own requests'
      });
      return;
    }
    
    requests.remove(request);
    
    res.status(200).json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book'
    });
  }
};

// router.get('/requests/owner', authMiddleware,isOwner,updateUserProfile);
export const getAllRequests = (req: Request, res: Response): void => {
  try {
    const user = req.user;
    const requests = getRequests();
    const allReq = requests.find()
   

    const formattedRequests = allReq.map((req:any) => ({
      ...req,
      id: req.$loki
    }));
    
    res.status(200).json({
      success: true,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error('Get Requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving books'
    });
  }
};


// router.put('/requests/owner/me',authMiddleware,isOwner, updateUserProfile);

export const getAllMyRequests = (req: Request, res: Response): void => {
  try {
    const user = req.user;
    const requests = getRequests();
    const allReq = requests.find({ownerId:user?.$loki})
   

    const formattedRequests = allReq.map((req:any) => ({
      ...req,
      id: req.$loki
    }));
    
    res.status(200).json({
      success: true,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error('Get Requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving books'
    });
  }
};

// router.put('/requests/owner/:id',authMiddleware,isOwner, updateUserProfile);
export const updateRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.$loki) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }
    
    const requestId = parseInt(req.params.id);
    
    if (isNaN(requestId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
      return;
    }
    
    const requests = getRequests();
    const request = requests.findOne({ $loki: requestId });
    
    if (!request) {
      res.status(404).json({
        success: false,
        message: 'Request not found'
      });
      return;
    }
    
   
    
    const { response } = req.body;
    
  
    request.response = response;
    request.respond = true;
    request.ownerId = req.user.$loki;

    requests.update(request);
    res.status(200).json({
      success: true,
      book: {
        ...request,
        id: request.$loki
      },
      message: 'Request updated successfully'
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request'
    });
  }
};