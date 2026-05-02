import { MCQSet } from '../models/index.js';
import slugify from 'slugify';

// @desc    Get all MCQ sets
// @route   GET /api/mcqs
// @access  Public
export const getMCQSets = async (req, res) => {
  try {
    const mcqSets = await MCQSet.find({ isActive: true })
      .select('-questions')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      mcqSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single MCQ set with questions
// @route   GET /api/mcqs/:id
// @access  Public
export const getMCQSet = async (req, res) => {
  try {
    const mcqSet = await MCQSet.findById(req.params.id);

    if (!mcqSet) {
      return res.status(404).json({
        success: false,
        message: 'MCQ set not found'
      });
    }

    res.json({
      success: true,
      mcqSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get MCQ sets by category
// @route   GET /api/mcqs/category/:category
// @access  Public
export const getMCQSetsByCategory = async (req, res) => {
  try {
    const mcqSets = await MCQSet.find({
      category: req.params.category,
      isActive: true
    }).select('-questions');

    res.json({
      success: true,
      mcqSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create MCQ set
// @route   POST /api/admin/mcqs
// @access  Private/Admin
export const createMCQSet = async (req, res) => {
  try {
    const { title, category, description, difficulty, timeLimit, questions } = req.body;

    const mcqSet = await MCQSet.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      category,
      description,
      difficulty,
      timeLimit,
      questions
    });

    res.status(201).json({
      success: true,
      mcqSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update MCQ set
// @route   PUT /api/admin/mcqs/:id
// @access  Private/Admin
export const updateMCQSet = async (req, res) => {
  try {
    let mcqSet = await MCQSet.findById(req.params.id);

    if (!mcqSet) {
      return res.status(404).json({
        success: false,
        message: 'MCQ set not found'
      });
    }

    if (req.body.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    mcqSet = await MCQSet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      mcqSet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete MCQ set
// @route   DELETE /api/admin/mcqs/:id
// @access  Private/Admin
export const deleteMCQSet = async (req, res) => {
  try {
    const mcqSet = await MCQSet.findById(req.params.id);

    if (!mcqSet) {
      return res.status(404).json({
        success: false,
        message: 'MCQ set not found'
      });
    }

    await mcqSet.deleteOne();

    res.json({
      success: true,
      message: 'MCQ set deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all MCQ sets (Admin)
// @route   GET /api/admin/mcqs
// @access  Private/Admin
export const getAdminMCQSets = async (req, res) => {
  try {
    const mcqSets = await MCQSet.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      mcqSets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
