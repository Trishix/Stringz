const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
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
        type: Number, // in minutes
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
    timestamps: true
});

// Indexes for search and filtering
lessonSchema.index({ category: 1 });
lessonSchema.index({ price: 1 });
lessonSchema.index({ createdAt: -1 });
lessonSchema.index({ title: 'text', description: 'text' });
lessonSchema.index({ popularity: -1 });

// Virtual for formatted price
lessonSchema.virtual('formattedPrice').get(function () {
    return `₹${this.price}`;
});

module.exports = mongoose.model('Lesson', lessonSchema);
