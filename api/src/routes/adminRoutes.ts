import express, { Router } from 'express';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { 
  adminLogin,
  createAssessment,
  getAssessments,
  deleteAssessment,
  getAdminStats,
} from '../controllers/adminController';

const router: Router = express.Router();

// Public routes
router.post('/login', adminLogin as express.RequestHandler);

// Protected admin routes
router.use(auth as express.RequestHandler, adminAuth as express.RequestHandler);
router.post('/assessments', createAssessment as express.RequestHandler);
router.get('/assessments', getAssessments as express.RequestHandler);
router.delete('/assessments/:id', deleteAssessment as express.RequestHandler);
router.get('/stats', getAdminStats as express.RequestHandler);

export default router; 