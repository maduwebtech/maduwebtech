import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question']
  },
  options: [{
    type: String,
    required: [true, 'Please provide options']
  }],
  correctIndex: {
    type: Number,
    required: [true, 'Please specify correct answer index'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  }
});

const mcqSetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Please select a book']
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please select a chapter']
  },
  description: {
    type: String,
    default: ''
  },
  questions: [questionSchema],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  timeLimit: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const MCQSet = mongoose.model('MCQSet', mcqSetSchema);

export default MCQSet;
