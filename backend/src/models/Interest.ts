import mongoose, { Document, Schema } from 'mongoose';

export interface IInterest extends Document {
    name: string;
    icon: string;
    description?: string;
    category?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const interestSchema = new Schema<IInterest>(
    {
        name: {
            type: String,
            required: [true, 'Interest name is required'],
            trim: true,
        },
        icon: {
            type: String,
            required: [true, 'Icon is required'],
            trim: true,
        },
        description: {
            type: String,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        category: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
interestSchema.index({ order: 1, createdAt: -1 });

export const Interest = mongoose.model<IInterest>('Interest', interestSchema);
