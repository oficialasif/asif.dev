
import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
    text: string;
    contentType: 'plain' | 'html';
    priority: 'low' | 'medium' | 'high';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NoticeSchema: Schema = new Schema({
    text: { type: String, required: true },
    contentType: { type: String, enum: ['plain', 'html'], default: 'html' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export default mongoose.model<INotice>('Notice', NoticeSchema);
