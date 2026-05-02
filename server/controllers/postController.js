import { Post, Category, Comment } from '../models/index.js';
import slugify from 'slugify';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published' };

    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        query.category = category._id;
      }
    }

    if (req.query.postType) {
      query.postType = req.query.postType;
    }

    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }

    const posts = await Post.find(query)
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
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

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      status: 'published'
    })
      .populate('category', 'name slug color icon')
      .populate('author', 'name avatar')
      .populate({
        path: 'comments',
        match: { status: 'approved' },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Get related posts
    const relatedPosts = await Post.find({
      category: post.category._id,
      status: 'published',
      _id: { $ne: post._id }
    })
      .populate('category', 'name slug color')
      .limit(3);

    res.json({
      success: true,
      post,
      relatedPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get latest posts
// @route   GET /api/posts/latest
// @access  Public
export const getLatestPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const posts = await Post.find({ status: 'published' })
      .populate('category', 'name slug color')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all posts (Admin)
// @route   GET /api/admin/posts
// @access  Private/Admin
export const getAdminPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.postType) {
      query.postType = req.query.postType;
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
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

// @desc    Create post
// @route   POST /api/admin/posts
// @access  Private/Admin
export const createPost = async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    if (req.file) {
      postData.thumbnail = req.file.path;
    }

    const post = await Post.create(postData);

    // Update category post count
    await Category.findByIdAndUpdate(post.category, {
      $inc: { postCount: 1 }
    });

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/admin/posts/:id
// @access  Private/Admin
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const oldCategory = post.category;

    if (req.file) {
      req.body.thumbnail = req.file.path;
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Update category post counts if category changed
    if (req.body.category && req.body.category.toString() !== oldCategory.toString()) {
      await Category.findByIdAndUpdate(oldCategory, { $inc: { postCount: -1 } });
      await Category.findByIdAndUpdate(req.body.category, { $inc: { postCount: 1 } });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update category post count
    await Category.findByIdAndUpdate(post.category, {
      $inc: { postCount: -1 }
    });

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle post status
// @route   PATCH /api/admin/posts/:id/status
// @access  Private/Admin
export const togglePostStatus = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.status = post.status === 'published' ? 'draft' : 'published';
    if (post.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }

    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
