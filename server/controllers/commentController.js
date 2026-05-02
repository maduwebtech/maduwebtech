import { Comment, Post } from '../models/index.js';

// @desc    Submit a comment
// @route   POST /api/comments
// @access  Public
export const submitComment = async (req, res) => {
  try {
    const { postId, name, email, message } = req.body;

    if (!postId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = await Comment.create({
      post: postId,
      name,
      email,
      message,
      status: 'pending'
    });

    // Add comment to post
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment submitted and is pending approval',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all comments (Admin)
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const comments = await Comment.find(query)
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(query);

    res.json({
      success: true,
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update comment status
// @route   PATCH /api/admin/comments/:id/status
// @access  Private/Admin
export const updateCommentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.status = status;
    await comment.save();

    res.json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Remove from post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id }
    });

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
