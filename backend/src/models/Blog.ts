
import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    tags: string[];
    readTime: string;
    author: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    tags: [{ type: String }],
    readTime: { type: String, default: '5 min read' },
    author: { type: String, default: 'Asif' },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
