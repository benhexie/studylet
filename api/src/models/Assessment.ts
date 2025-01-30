import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  time: {
    type: Number,
    default: 60,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Assessment', assessmentSchema); 