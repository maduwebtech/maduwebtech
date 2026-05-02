import { Settings } from '../models/index.js';

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get public settings
// @route   GET /api/settings
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne().select('siteName tagline logo socialLinks seo aboutPage');

    if (!settings) {
      settings = {
        siteName: 'Madu Web Tech',
        tagline: 'Learn Coding with Free Tutorials',
        logo: '',
        socialLinks: {},
        seo: {},
        aboutPage: {}
      };
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
