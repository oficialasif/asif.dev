import { Router } from 'express';
import {
    getGalleryImages,
    uploadGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
} from '../controllers/gallery.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getGalleryImages);
router.post('/', authenticate, isAdmin, uploadSingle, uploadGalleryImage);
router.put('/:id', authenticate, isAdmin, updateGalleryImage);
router.delete('/:id', authenticate, isAdmin, deleteGalleryImage);

export default router;
