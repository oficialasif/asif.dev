import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getProfile);
router.put('/', authenticate, isAdmin, upload.array('avatar', 1), updateProfile);

export default router;
