import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { Post, Category, Comment, MCQSet } from '../models/index.js';

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalPosts, totalCategories, totalMCQSets, totalComments, pendingComments] = await Promise.all([
      Post.countDocuments(),
      Category.countDocuments(),
      MCQSet.countDocuments(),
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'pending' })
    ]);

    const recentPosts = await Post.find({})
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentComments = await Comment.find({})
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalPosts,
        totalCategories,
        totalMCQSets,
        totalComments,
        pendingComments
      },
      recentPosts,
      recentComments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
