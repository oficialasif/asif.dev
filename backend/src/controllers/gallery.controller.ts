import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs';

export const getGalleryImages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { category } = req.query;
    const filter: any = {};
    if (category) filter.category = category;

    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
        success: true,
        count: images.length,
        data: { images },
    });
});

export const uploadGalleryImage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: 'Please upload an image',
        });
        return;
    }

    const uploadResult = await uploadToCloudinary(req.file, 'portfolio/gallery');

    const image = await Gallery.create({
        ...req.body,
        imageUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: { image },
    });
});

export const updateGalleryImage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!image) {
        res.status(404).json({
            success: false,
            message: 'Image not found',
        });
        return;
    }

    res.status(200).json({
        success: true,
        message: 'Image updated successfully',
        data: { image },
    });
});

export const deleteGalleryImage = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
        res.status(404).json({
            success: false,
            message: 'Image not found',
        });
        return;
    }

    await deleteFromCloudinary(image.cloudinaryId);
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
    });
});
