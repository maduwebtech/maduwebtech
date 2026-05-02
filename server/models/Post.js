import mongoose from 'mongoose';
import slugify from 'slugify';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  postType: {
    type: String,
    enum: ['free_source_code', 'blog'],
    default: 'blog'
  },
  body: {
    type: String,
    required: [true, 'Please provide content']
  },
  thumbnail: {
    type: String,
    default: ''
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  sourceCodeUrl: {
    type: String,
    default: ''
  },
  downloadUrl: {
    type: String,
    default: ''
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot be more than 300 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

postSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

postSchema.index({ title: 'text', body: 'text', tags: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
