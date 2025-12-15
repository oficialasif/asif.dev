import { Request, Response, NextFunction } from 'express';
import Notice from '../models/Notice';
import { ApiError } from '../middleware/error.middleware';

export const getAllNotices = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const notices = await Notice.find({ isActive: true }).sort({ priority: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: notices
        });
    } catch (error) {
        next(new ApiError(500, 'Error fetching notices'));
    }
};

export const createNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notice = await Notice.create(req.body);
        res.status(201).json({
            success: true,
            data: notice
        });
    } catch (error) {
        next(new ApiError(500, 'Error creating notice'));
    }
};

export const deleteNotice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return next(new ApiError(404, 'Notice not found'));
        }
        res.status(200).json({
            success: true,
            message: 'Notice deleted successfully'
        });
    } catch (error) {
        next(new ApiError(500, 'Error deleting notice'));
    }
};
