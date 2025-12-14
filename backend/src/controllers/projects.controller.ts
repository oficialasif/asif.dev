import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs';

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { featured, category, status } = req.query;

    const filter: any = {};
    if (featured) filter.featured = featured === 'true';
    if (category) filter.category = category;
    if (status) filter.status = status;

    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
        success: true,
        count: projects.length,
        data: { projects },
    });
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get project by ID
 * @access  Public
 */
export const getProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            message: 'Project not found',
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: { project },
    });
});

/**
 * @route   POST /api/projects
 * @desc    Create project
 * @access  Private (Admin)
 */
export const createProject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Handle image uploads
    if (req.files && Array.isArray(req.files)) {
        const uploadResults = await uploadMultipleToCloudinary(req.files, 'portfolio/projects');
        req.body.images = uploadResults.map(r => r.secure_url);
        req.body.imagesCloudinaryIds = uploadResults.map(r => r.public_id);

        // Delete local files
        req.files.forEach(file => fs.unlinkSync(file.path));
    }

    const project = await Project.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: { project },
    });
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private (Admin)
 */
export const updateProject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    let project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            message: 'Project not found',
        });
        return;
    }

    // Handle new image uploads
    if (req.files && Array.isArray(req.files)) {
        const uploadResults = await uploadMultipleToCloudinary(req.files, 'portfolio/projects');
        const newImages = uploadResults.map(r => r.secure_url);
        const newCloudinaryIds = uploadResults.map(r => r.public_id);

        req.body.images = [...(project.images || []), ...newImages];
        req.body.imagesCloudinaryIds = [...(project.imagesCloudinaryIds || []), ...newCloudinaryIds];

        // Delete local files
        req.files.forEach(file => fs.unlinkSync(file.path));
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: { project },
    });
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
export const deleteProject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404).json({
            success: false,
            message: 'Project not found',
        });
        return;
    }

    // Delete images from Cloudinary
    if (project.imagesCloudinaryIds && project.imagesCloudinaryIds.length > 0) {
        await Promise.all(
            project.imagesCloudinaryIds.map(id => deleteFromCloudinary(id))
        );
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
    });
});
