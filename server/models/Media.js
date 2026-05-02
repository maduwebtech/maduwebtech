import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  format: {
    type: String
  },
  size: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
