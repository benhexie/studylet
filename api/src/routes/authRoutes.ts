import express from 'express';
import { register, login, logout, forgotPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/logout', logout as any);
router.post('/forgot-password', forgotPassword as any);

export default router; 