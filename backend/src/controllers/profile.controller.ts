import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs';

/**
 * @route   GET /api/profile
 * @desc    Get profile data (Singleton)
 * @access  Public
 */
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let profile = await Profile.findOne();

    if (!profile) {
        // Return null/empty data instead of 404 for initialization
        res.status(200).json({
            success: true,
            data: { profile: null }
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: { profile }
    });
});

/**
 * @route   PUT /api/profile
 * @desc    Update or Create profile data
 * @access  Private (Admin)
 */
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    // Handle avatar upload if present
    let avatarUrl;
    if (req.files && !Array.isArray(req.files) && req.files['avatar']) {
        // Single file upload logic
        const file = req.files['avatar'][0];
        const uploadResult = await uploadMultipleToCloudinary([file], 'portfolio/profile');
        avatarUrl = uploadResult[0].secure_url;
        fs.unlinkSync(file.path);
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Fallback if configured as array
        const uploadResults = await uploadMultipleToCloudinary(req.files as Express.Multer.File[], 'portfolio/profile');
        avatarUrl = uploadResults[0].secure_url;
        req.files.forEach(file => fs.unlinkSync(file.path));
    }

    const updateData = { ...req.body };
    if (avatarUrl) {
        updateData.avatar = avatarUrl;
    }

    // Parse JSON strings back to objects if they came from FormData
    // FormData sends complex structures as JSON strings
    ['stats', 'experience', 'education', 'coreSkills', 'languages', 'socialLinks', 'certifications', 'achievements', 'interests'].forEach(field => {
        if (updateData[field] && typeof updateData[field] === 'string') {
            try {
                updateData[field] = JSON.parse(updateData[field]);
            } catch (e) {
                console.error(`Failed to parse ${field}:`, e);
            }
        }
    });

    // Upsert: Update if exists, Create if not
    const profile = await Profile.findOneAndUpdate({}, updateData, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
    });

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile }
    });
});
