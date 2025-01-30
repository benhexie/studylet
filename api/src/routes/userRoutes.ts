import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';
import multer from 'multer';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, upload.single('avatar'), updateProfile as any);

export default router; 