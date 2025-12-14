import { Router } from 'express';
import { getInterests, createInterest, updateInterest, deleteInterest } from '../controllers/content.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getInterests);
router.post('/', authenticate, isAdmin, createInterest);
router.put('/:id', authenticate, isAdmin, updateInterest);
router.delete('/:id', authenticate, isAdmin, deleteInterest);

export default router;
