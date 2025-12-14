import { Router } from 'express';
import { getMusic, createMusic, updateMusic, deleteMusic } from '../controllers/content.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getMusic);
router.post('/', authenticate, isAdmin, createMusic);
router.put('/:id', authenticate, isAdmin, updateMusic);
router.delete('/:id', authenticate, isAdmin, deleteMusic);

export default router;
