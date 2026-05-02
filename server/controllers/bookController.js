import { Book, MCQSet } from '../models/index.js';
import slugify from 'slugify';

// @desc    Get all books (public)
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true })
      .select('-chapters')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single book with chapters
// @route   GET /api/books/:slug
// @access  Public
export const getBookBySlug = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug, isActive: true });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Get MCQ count for each chapter
    const chaptersWithCount = await Promise.all(
      book.chapters.map(async (chapter) => {
        const mcqCount = await MCQSet.countDocuments({
          book: book._id,
          chapter: chapter._id
        });
        return {
          ...chapter.toObject(),
          mcqCount
        };
      })
    );

    res.json({
      success: true,
      book: {
        ...book.toObject(),
        chapters: chaptersWithCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chapters for a book
// @route   GET /api/books/:slug/chapters
// @access  Public
export const getBookChapters = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug, isActive: true });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      chapters: book.chapters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get MCQs for a specific chapter
// @route   GET /api/books/:slug/chapters/:chapterId/mcqs
// @access  Public
export const getChapterMCQs = async (req, res) => {
  try {
    const book = await Book.findOne({ slug: req.params.slug });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const chapter = book.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    const mcqs = await MCQSet.find({
      book: book._id,
      chapter: chapter._id,
      isActive: true
    });

    res.json({
      success: true,
      chapter,
      mcqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADMIN ROUTES

// @desc    Get all books (admin)
// @route   GET /api/admin/books
// @access  Private/Admin
export const getAdminBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create book
// @route   POST /api/admin/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const { title, author, description, subject, chapters } = req.body;

    const book = await Book.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      author,
      description,
      subject,
      chapters: chapters?.map((c, i) => ({ name: c, order: i })) || []
    });

    res.status(201).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/admin/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (req.body.title && req.body.title !== book.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/admin/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book has MCQs
    const mcqCount = await MCQSet.countDocuments({ book: book._id });
    if (mcqCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete book with ${mcqCount} MCQ sets. Delete MCQs first.`
      });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add chapter to book
// @route   POST /api/admin/books/:id/chapters
// @access  Private/Admin
export const addChapter = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const { name } = req.body;
    const order = book.chapters.length;

    book.chapters.push({ name, order });
    await book.save();

    res.status(201).json({
      success: true,
      chapter: book.chapters[book.chapters.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete chapter from book
// @route   DELETE /api/admin/books/:id/chapters/:chapterId
// @access  Private/Admin
export const deleteChapter = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if chapter has MCQs
    const mcqCount = await MCQSet.countDocuments({
      book: book._id,
      chapter: req.params.chapterId
    });

    if (mcqCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete chapter with ${mcqCount} MCQ sets. Delete MCQs first.`
      });
    }

    book.chapters = book.chapters.filter(c => c._id.toString() !== req.params.chapterId);
    await book.save();

    res.json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
