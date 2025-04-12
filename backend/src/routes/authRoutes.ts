import express from 'express';
import { register, login, verifyToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verifyToken/:id', verifyToken);

export default router;
