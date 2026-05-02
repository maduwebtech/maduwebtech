import express from 'express';
import { login, logout, getProfile, updatePassword, checkAuth } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/password', protect, updatePassword);
router.get('/check', checkAuth);

export default router;
