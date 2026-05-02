import express from 'express';
import {
  getPosts,
  getPostBySlug,
  getLatestPosts,
  getAdminPosts,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus
} from '../controllers/postController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/latest', getLatestPosts);
router.get('/:slug', getPostBySlug);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminPosts);
router.post('/', protect, adminOnly, uploadSingle, createPost);
router.put('/:id', protect, adminOnly, uploadSingle, updatePost);
router.delete('/:id', protect, adminOnly, deletePost);
router.patch('/:id/status', protect, adminOnly, togglePostStatus);

export default router;
