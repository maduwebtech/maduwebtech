import express from 'express';
import {
  getBooks,
  getBookBySlug,
  getBookChapters,
  getChapterMCQs,
  getAdminBooks,
  createBook,
  updateBook,
  deleteBook,
  addChapter,
  deleteChapter
} from '../controllers/bookController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/:slug', getBookBySlug);
router.get('/:slug/chapters', getBookChapters);
router.get('/:slug/chapters/:chapterId/mcqs', getChapterMCQs);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAdminBooks);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);
router.post('/:id/chapters', protect, adminOnly, addChapter);
router.delete('/:id/chapters/:chapterId', protect, adminOnly, deleteChapter);

export default router;
