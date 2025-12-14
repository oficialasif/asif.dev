
import { Router } from 'express';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.route('/')
    .get(getAllBlogs)
    .post(authenticate, isAdmin, createBlog);

router.route('/:id')
    .put(authenticate, isAdmin, updateBlog)
    .delete(authenticate, isAdmin, deleteBlog);

export default router;
