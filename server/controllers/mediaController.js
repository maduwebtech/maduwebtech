import { Media } from '../models/index.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Upload media
// @route   POST /api/admin/media/upload
// @access  Private/Admin
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const media = await Media.create({
      url: req.file.path,
      publicId: req.file.filename,
      filename: req.file.originalname,
      format: req.file.format || req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      media
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all media
// @route   GET /api/admin/media
// @access  Private/Admin
export const getMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const media = await Media.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Media.countDocuments({});

    res.json({
      success: true,
      media,
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

// @desc    Delete media
// @route   DELETE /api/admin/media/:id
// @access  Private/Admin
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }

    // Delete from Cloudinary
    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    await media.deleteOne();

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
