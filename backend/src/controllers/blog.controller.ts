import { Request, Response } from 'express';
import Blog from '../models/Blog';
import { ApiError, asyncHandler } from '../middleware/error.middleware';

// @ts-ignore
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: blogs
    });
});

// @ts-ignore
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.create(req.body);
    res.status(201).json({
        success: true,
        data: blog
    });
});

// @ts-ignore
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) throw new ApiError(404, 'Blog not found');
    res.status(200).json({
        success: true,
        data: blog
    });
});

// @ts-ignore
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) throw new ApiError(404, 'Blog not found');
    res.status(200).json({
        success: true,
        message: 'Blog deleted successfully'
    });
});
