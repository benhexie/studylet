import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/stats', auth, getDashboardStats);

export default router; 