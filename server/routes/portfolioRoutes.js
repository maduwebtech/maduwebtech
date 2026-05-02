import express from 'express';
import * as portfolioController from '../controllers/portfolioController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', portfolioController.getPortfolioItems);

// Admin routes
router.get('/admin/all', protect, adminOnly, portfolioController.getAllPortfolioItems);
router.get('/admin/:id', protect, adminOnly, portfolioController.getPortfolioItem);
router.post('/', protect, adminOnly, portfolioController.createPortfolioItem);
router.put('/:id', protect, adminOnly, portfolioController.updatePortfolioItem);
router.delete('/:id', protect, adminOnly, portfolioController.deletePortfolioItem);
router.patch('/:id/status', protect, adminOnly, portfolioController.toggleStatus);

export default router;
