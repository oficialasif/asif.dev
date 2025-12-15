import { Request, Response, NextFunction } from 'express';
import { Theme } from '../models/Theme';
import { ApiError } from '../middleware/error.middleware';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getTheme = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        let theme = await Theme.findOne({ isActive: true });

        // If no active theme, try to find default
        if (!theme) {
            theme = await Theme.findOne({ isDefault: true });
        }

        // If still no theme, create a default one
        if (!theme) {
            theme = await Theme.create({
                name: 'Default Theme',
                isActive: true,
                isDefault: true
            });
        }

        res.status(200).json({
            success: true,
            data: { theme }
        });
    } catch (error) {
        next(new ApiError(500, 'Error fetching theme'));
    }
};

export const updateTheme = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let theme = await Theme.findOne({ isActive: true });
        if (!theme) {
            theme = await Theme.create({
                name: 'Custom Theme',
                isActive: true,
                isDefault: false
            });
        }

        // Handle File Upload for Favicon
        if (req.file) {
            const result = await uploadToCloudinary(req.file);
            req.body.faviconUrl = result.secure_url;
        }

        // Update fields
        // The frontend sends flattened keys like "colors.primary", "fonts.heading" via FormData
        // We need to convert these into MongoDB update format
        const updates: any = {};

        // Process all keys from req.body
        Object.keys(req.body).forEach(key => {
            // If key contains a dot, it's already flattened (e.g., "colors.primary")
            if (key.includes('.')) {
                updates[key] = req.body[key];
            } else {
                // Direct field
                if (key === 'enableAnimations') {
                    // Convert string to boolean
                    updates[key] = req.body[key] === 'true' || req.body[key] === true;
                } else if (key === 'scrollAnimation' || key === 'faviconUrl') {
                    updates[key] = req.body[key];
                }
            }
        });

        theme = await Theme.findByIdAndUpdate(
            theme._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: { theme }
        });
    } catch (error) {
        next(new ApiError(500, 'Error updating theme'));
    }
};

export const resetTheme = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // Delete current active theme if it's not default
        await Theme.deleteMany({ isDefault: false });

        // Ensure default theme exists and is active
        let defaultTheme = await Theme.findOne({ isDefault: true });
        if (!defaultTheme) {
            defaultTheme = await Theme.create({
                name: 'Default Theme',
                isActive: true,
                isDefault: true
            });
        } else {
            defaultTheme.isActive = true;
            await defaultTheme.save();
        }

        res.status(200).json({
            success: true,
            message: 'Theme reset to default',
            data: { theme: defaultTheme }
        });
    } catch (error) {
        next(new ApiError(500, 'Error resetting theme'));
    }
};
