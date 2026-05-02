import express from 'express';
import { uploadMedia, getMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, adminOnly, uploadSingle, uploadMedia);
router.get('/', protect, adminOnly, getMedia);
router.delete('/:id', protect, adminOnly, deleteMedia);

export default router;
