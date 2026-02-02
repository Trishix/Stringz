import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    price: number;
    category: 'beginner' | 'intermediate' | 'advanced';
    duration: number; // in minutes
    instructor: string;
    salesCount: number;
    popularity: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    formattedPrice?: string; // Virtual
}

const lessonSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a lesson title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a lesson description']
    },
    videoUrl: {
        type: String,
        required: [true, 'Please provide a video URL']
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 99
    },
    category: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Please provide a category']
    },
    duration: {
        type: Number,
        required: [true, 'Please provide duration in minutes']
    },
    instructor: {
        type: String,
        required: [true, 'Please provide an instructor name']
    },
    salesCount: {
        type: Number,
        default: 0
    },
    popularity: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes
lessonSchema.index({ category: 1 });
lessonSchema.index({ price: 1 });
lessonSchema.index({ createdAt: -1 });
lessonSchema.index({ title: 'text', description: 'text' });
lessonSchema.index({ popularity: -1 });

// Virtual
lessonSchema.virtual('formattedPrice').get(function (this: ILesson) {
    return `₹${this.price}`;
});

export default mongoose.model<ILesson>('Lesson', lessonSchema);
