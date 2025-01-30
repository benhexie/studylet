import express from 'express';
import { auth } from '../middleware/auth';
import {
  getAssessments,
  getAssessment,
  uploadAssessment,
  getQuestions,
  submitPractice,
  getPracticeSessions,
  getSubjects,
  getResults,
} from '../controllers/assessmentController';
import { upload } from '../middleware/upload';

const router = express.Router();

// Get all subjects (no ID conflict)
router.get('/subjects', auth, getSubjects as any);

// Get all practice sessions (no ID conflict)
router.get('/practice-sessions', auth, getPracticeSessions as any);

// Routes with ID parameter - specific to general
router.get('/:id/results', auth, getResults as any);
router.get('/:id/questions', auth, getQuestions as any);
router.post('/:id/submit', auth, submitPractice as any);

// Upload route (no ID conflict)
router.post('/upload', auth, upload.single('document'), uploadAssessment as any);

// General assessment routes
router.get('/', auth, getAssessments as any);
router.get('/:id', auth, getAssessment as any);

export default router; 