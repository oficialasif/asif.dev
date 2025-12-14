import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Gallery } from '../models/Gallery';
import { Music } from '../models/Music';
import { Interest } from '../models/Interest';
import { asyncHandler } from '../middleware/error.middleware';

export const getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const [projectsCount, galleryCount, musicCount, interestsCount] = await Promise.all([
        Project.countDocuments(),
        Gallery.countDocuments(),
        Music.countDocuments(),
        Interest.countDocuments(),
    ]);

    const featuredProjects = await Project.countDocuments({ featured: true });

    res.status(200).json({
        success: true,
        data: {
            stats: {
                projectsCount,
                galleryCount,
                musicCount,
                interestsCount,
                featuredProjects,
            },
        },
    });
});

export const getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Get projects by technology
    const projects = await Project.find();
    const techCount: { [key: string]: number } = {};

    projects.forEach(project => {
        project.technologies.forEach(tech => {
            techCount[tech] = (techCount[tech] || 0) + 1;
        });
    });

    const projectsByTech = Object.entries(techCount).map(([name, count]) => ({ name, count }));

    // Get gallery uploads over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const galleryByMonth = await Gallery.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
        success: true,
        data: {
            analytics: {
                projectsByTech,
                galleryByMonth,
            },
        },
    });
});
