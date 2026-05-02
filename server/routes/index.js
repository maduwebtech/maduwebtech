import express from 'express';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import bookRoutes from './bookRoutes.js';
import mcqRoutes from './mcqRoutes.js';
import commentRoutes from './commentRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';

const router = express.Router();

router.use('/admin', authRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/books', bookRoutes);
router.use('/mcqs', mcqRoutes);
router.use('/comments', commentRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/admin/media', mediaRoutes);
router.use('/admin/settings', settingsRoutes);
router.use('/admin/dashboard', dashboardRoutes);

export default router;
