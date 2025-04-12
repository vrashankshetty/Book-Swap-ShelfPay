import express from 'express';
import { getMyDashboard, getUserProfile, updateUserProfile } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();



router.get("/dashboard", authMiddleware, getMyDashboard)
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;
