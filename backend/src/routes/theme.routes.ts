import { Router } from 'express';
import { getTheme, updateTheme, resetTheme } from '../controllers/theme.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

router.get('/', getTheme);

router.put(
    '/',
    authenticate,
    isAdmin,
    upload.single('favicon'),
    updateTheme
);

router.post(
    '/reset',
    authenticate,
    isAdmin,
    resetTheme
);

export default router;
