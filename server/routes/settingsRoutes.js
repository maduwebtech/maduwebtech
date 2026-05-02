import express from 'express';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/public', getPublicSettings);

// Admin routes
router.get('/', protect, adminOnly, getSettings);
router.put('/', protect, adminOnly, updateSettings);

export default router;
