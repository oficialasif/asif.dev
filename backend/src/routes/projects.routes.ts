import { Router } from 'express';
import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/projects.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { uploadMultiple } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', authenticate, isAdmin, uploadMultiple, createProject);
router.put('/:id', authenticate, isAdmin, uploadMultiple, updateProject);
router.delete('/:id', authenticate, isAdmin, deleteProject);

export default router;
