import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    cloudinaryId: string;
    category?: string;
    tags: string[];
    order: number;
    width?: number;
    height?: number;
    createdAt: Date;
    updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
    {
        title: {
            type: String,
            required: [true, 'Image title is required'],
            trim: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Image URL is required'],
        },
        cloudinaryId: {
            type: String,
            required: [true, 'Cloudinary ID is required'],
        },
        category: {
            type: String,
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        order: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
gallerySchema.index({ order: 1, createdAt: -1 });

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);
