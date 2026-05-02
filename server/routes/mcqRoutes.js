import express from 'express';
import {
  getMCQSets,
  getMCQSet,
  getMCQSetsByCategory,
  createMCQSet,
  updateMCQSet,
  deleteMCQSet,
  getAdminMCQSets
} from '../controllers/mcqController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getMCQSets);
router.get('/category/:category', getMCQSetsByCategory);
router.get('/:id', getMCQSet);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminMCQSets);
router.post('/', protect, adminOnly, createMCQSet);
router.put('/:id', protect, adminOnly, updateMCQSet);
router.delete('/:id', protect, adminOnly, deleteMCQSet);

export default router;
