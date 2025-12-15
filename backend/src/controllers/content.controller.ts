import { Request, Response } from 'express';
import { Music } from '../models/Music';
import { Interest } from '../models/Interest';
import { Theme } from '../models/Theme';
import { SiteSettings } from '../models/SiteSettings';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Music Controllers
export const getMusic = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const music = await Music.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: music.length, data: { music } });
});

export const createMusic = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const music = await Music.create(req.body);
    res.status(201).json({ success: true, message: 'Music created successfully', data: { music } });
});

export const updateMusic = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const music = await Music.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!music) {
        res.status(404).json({ success: false, message: 'Music not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Music updated successfully', data: { music } });
});

export const deleteMusic = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
        res.status(404).json({ success: false, message: 'Music not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Music deleted successfully' });
});

// Interest Controllers
export const getInterests = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const interests = await Interest.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: interests.length, data: { interests } });
});

export const createInterest = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const interest = await Interest.create(req.body);
    res.status(201).json({ success: true, message: 'Interest created successfully', data: { interest } });
});

export const updateInterest = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const interest = await Interest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!interest) {
        res.status(404).json({ success: false, message: 'Interest not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Interest updated successfully', data: { interest } });
});

export const deleteInterest = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const interest = await Interest.findByIdAndDelete(req.params.id);
    if (!interest) {
        res.status(404).json({ success: false, message: 'Interest not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Interest deleted successfully' });
});

// Theme Controllers
export const getTheme = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const theme = await Theme.findOne({ isActive: true });
    if (!theme) {
        res.status(404).json({ success: false, message: 'No active theme found' });
        return;
    }
    res.status(200).json({ success: true, data: { theme } });
});

export const updateTheme = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    let theme = await Theme.findOne({ isActive: true });
    if (!theme) {
        theme = await Theme.create({ ...req.body, isActive: true });
    } else {
        theme = await Theme.findByIdAndUpdate(theme._id, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, message: 'Theme updated successfully', data: { theme } });
});

export const resetTheme = asyncHandler(async (_req: AuthRequest, res: Response): Promise<void> => {
    await Theme.deleteMany({});
    const theme = await Theme.create({ name: 'Default Theme', isActive: true, isDefault: true });
    res.status(200).json({ success: true, message: 'Theme reset to default', data: { theme } });
});

// Site Settings Controllers
export const getSettings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create({});
    }
    res.status(200).json({ success: true, data: { settings } });
});

export const updateSettings = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    let settings = await SiteSettings.findOne();
    if (!settings) {
        settings = await SiteSettings.create(req.body);
    } else {
        settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.status(200).json({ success: true, message: 'Settings updated successfully', data: { settings } });
});
