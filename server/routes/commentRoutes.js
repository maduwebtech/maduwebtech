import express from 'express';
import {
  submitComment,
  getComments,
  updateCommentStatus,
  deleteComment
} from '../controllers/commentController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', submitComment);

// Admin routes
router.get('/admin/all', protect, adminOnly, getComments);
router.patch('/:id/status', protect, adminOnly, updateCommentStatus);
router.delete('/:id', protect, adminOnly, deleteComment);

export default router;
