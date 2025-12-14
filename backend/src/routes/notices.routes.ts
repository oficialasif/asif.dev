
import { Router } from 'express';
import { getAllNotices, createNotice, deleteNotice } from '../controllers/notices.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.route('/')
    .get(getAllNotices)
    .post(authenticate, isAdmin, createNotice);

router.route('/:id')
    .delete(authenticate, isAdmin, deleteNotice);

export default router;
