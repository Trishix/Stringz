import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
    user: mongoose.Types.ObjectId;
    lesson: mongoose.Types.ObjectId;
    watchedDuration: number; // in seconds
    lastPosition: number; // timestamp in video
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true,
        },
        watchedDuration: {
            type: Number,
            default: 0,
        },
        lastPosition: {
            type: Number,
            default: 0,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique progress record per user per lesson
UserProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
