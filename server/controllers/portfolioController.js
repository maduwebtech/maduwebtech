import PortfolioItem from '../models/PortfolioItem.js';

// Public - Get all active portfolio items
export const getPortfolioItems = async (req, res) => {
  try {
    const items = await PortfolioItem.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Get all portfolio items
export const getAllPortfolioItems = async (req, res) => {
  try {
    const items = await PortfolioItem.find().sort({ order: 1, createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Get single portfolio item
export const getPortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Create portfolio item
export const createPortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin - Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json({ item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin - Delete portfolio item
export const deletePortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    res.json({ message: 'Portfolio item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Toggle active status
export const toggleStatus = async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
