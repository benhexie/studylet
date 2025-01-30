import mongoose from 'mongoose';

const practiceSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  answers: {
    type: Map,
    of: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timeSpent: {
    type: String,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PracticeSession', practiceSessionSchema); 