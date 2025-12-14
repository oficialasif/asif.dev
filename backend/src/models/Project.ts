import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    longDescription?: string;
    images: string[];
    imagesCloudinaryIds: string[];
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    featured: boolean;
    order: number;
    category?: string;
    status: 'completed' | 'in-progress' | 'planned';
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        longDescription: {
            type: String,
            maxlength: [2000, 'Long description cannot exceed 2000 characters'],
        },
        images: [
            {
                type: String,
            },
        ],
        imagesCloudinaryIds: [
            {
                type: String,
            },
        ],
        technologies: [
            {
                type: String,
                required: true,
            },
        ],
        githubUrl: {
            type: String,
            trim: true,
        },
        liveUrl: {
            type: String,
            trim: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['completed', 'in-progress', 'planned'],
            default: 'completed',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
projectSchema.index({ order: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
