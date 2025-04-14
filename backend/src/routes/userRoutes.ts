import express from 'express';
import { addRequest, deleteRequest, getAllMyRequests, getAllRequests, getMyDashboard, getUserEachRequest, getUserProfile, getUserRequests, updateRequest, updateUserProfile } from '../controllers/userController';
import { authMiddleware, isOwner } from '../middleware/authMiddleware';

const router = express.Router();



router.get("/dashboard", authMiddleware, getMyDashboard)
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);


router.get('/requests', authMiddleware, getUserRequests);
router.get('/requests/owner/me',authMiddleware,isOwner, getAllMyRequests);
router.get('/requests/owner', authMiddleware,isOwner,getAllRequests)
router.get('/requests/:id', authMiddleware, getUserEachRequest);
router.post('/requests', authMiddleware, addRequest);
router.delete('/requests/:id', authMiddleware, deleteRequest);
router.put('/requests/owner/:id',authMiddleware,isOwner, updateRequest);
1

export default router;
