import express from 'express';
import { getStatistics } from '../controllers/statisticsController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getStatistics);

export default router; 