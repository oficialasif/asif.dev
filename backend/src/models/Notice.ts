
import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
    text: string;
    priority: 'low' | 'medium' | 'high';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NoticeSchema: Schema = new Schema({
    text: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export default mongoose.model<INotice>('Notice', NoticeSchema);
