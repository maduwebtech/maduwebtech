import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  author: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    enum: ['Computer Science', 'Programming', 'Web Development', 'Database', 'Networking', 'Other']
  },
  chapters: [chapterSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
