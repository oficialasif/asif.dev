import { Router } from 'express';
import { getStats, getAnalytics } from '../controllers/stats.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/overview', authenticate, isAdmin, getStats);
router.get('/analytics', authenticate, isAdmin, getAnalytics);

export default router;
