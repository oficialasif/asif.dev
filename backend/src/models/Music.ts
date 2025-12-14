import mongoose, { Document, Schema } from 'mongoose';

export interface IMusic extends Document {
    title: string;
    artist: string;
    album?: string;
    coverUrl?: string;
    coverCloudinaryId?: string;
    audioUrl?: string;
    spotifyUrl?: string;
    duration?: number;
    order: number;
    genre?: string;
    releaseYear?: number;
    createdAt: Date;
    updatedAt: Date;
}

const musicSchema = new Schema<IMusic>(
    {
        title: {
            type: String,
            required: false,
            trim: true,
        },
        artist: {
            type: String,
            required: false,
            trim: true,
        },
        album: {
            type: String,
            trim: true,
        },
        coverUrl: {
            type: String,
        },
        coverCloudinaryId: {
            type: String,
        },
        audioUrl: {
            type: String,
        },
        spotifyUrl: {
            type: String,
            trim: true,
        },
        duration: {
            type: Number,
            min: 0,
        },
        order: {
            type: Number,
            default: 0,
        },
        genre: {
            type: String,
            trim: true,
        },
        releaseYear: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear() + 1,
        },
    },
    {
        timestamps: true,
    }
);

// Index for sorting
musicSchema.index({ order: 1, createdAt: -1 });

export const Music = mongoose.model<IMusic>('Music', musicSchema);
