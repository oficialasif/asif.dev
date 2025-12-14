import { Request, Response, NextFunction } from 'express';
import { Theme, ITheme } from '../models/Theme';
import { ApiError } from '../middleware/error.middleware';
import { uploadToCloudinary } from '../utils/cloudinary';

export const getTheme = async (req: Request, res: Response, next: NextFunction) => {
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
            const result = await uploadToCloudinary(req.file.buffer);
            req.body.faviconUrl = result.secure_url;
        }

        // Update fields
        // We use $set to allow partial updates of nested objects like colors/fonts
        const updates: any = {};

        // Helper to flatten nested objects for MongoDB update
        const flattenObject = (obj: any, prefix = '') => {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flattenObject(obj[key], `${prefix}${key}.`);
                } else {
                    updates[`${prefix}${key}`] = obj[key];
                }
            });
        };

        // If body has nested structures like colors: { primary: ... }
        if (req.body.colors) flattenObject(req.body.colors, 'colors.');
        if (req.body.fonts) flattenObject(req.body.fonts, 'fonts.');
        if (req.body.effects) flattenObject(req.body.effects, 'effects.');
        if (req.body.gradients) flattenObject(req.body.gradients, 'gradients.');

        // Direct fields
        if (req.body.enableAnimations !== undefined) updates.enableAnimations = req.body.enableAnimations;
        if (req.body.scrollAnimation !== undefined) updates.scrollAnimation = req.body.scrollAnimation;
        if (req.body.faviconUrl !== undefined) updates.faviconUrl = req.body.faviconUrl;

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

export const resetTheme = async (req: Request, res: Response, next: NextFunction) => {
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
