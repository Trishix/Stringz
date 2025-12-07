const Review = require('../models/review');

// @desc    Get all reviews for a lesson
// @route   GET /api/reviews/lesson/:lessonId
// @access  Public
exports.getLessonReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ lessonId: req.params.lessonId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    try {
        const { lessonId, rating, comment } = req.body;

        const review = await Review.create({
            lessonId,
            userId: req.user.id,
            rating,
            comment
        });

        // Populate user details to return immediately
        await review.populate('userId', 'name');

        res.status(201).json(review);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this lesson' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership
        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('userId', 'name');

        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check ownership or admin
        if (review.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
