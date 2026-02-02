import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    lessonId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema: Schema = new Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
    },
}, {
    timestamps: true,
});

// Prevent user from submitting multiple reviews for the same lesson
reviewSchema.index({ lessonId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', reviewSchema);
