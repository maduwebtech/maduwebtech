import { upload } from '../config/cloudinary.js';

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 5);

export const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  next();
};
