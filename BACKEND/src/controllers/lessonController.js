const Lesson = require('../models/lesson');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Public
exports.getAllLessons = async (req, res) => {
    try {
        const { search, category, sort, page = 1, limit = 10 } = req.query;
        const query = { isPublished: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (category && category !== 'All') {
            query.category = category.toLowerCase();
        }

        const skip = (page - 1) * limit;

        let sortOption = { createdAt: -1 }; // Default: Newest
        if (sort === 'popular') sortOption = { popularity: -1 };
        if (sort === 'price_low') sortOption = { price: 1 };
        if (sort === 'price_high') sortOption = { price: -1 };

        const lessons = await Lesson.find(query)
            .sort(sortOption)
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const total = await Lesson.countDocuments(query);

        res.json({
            lessons,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error("Error in getAllLessons:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Public
exports.getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Increment popularity
        lesson.popularity += 1;
        await lesson.save({ validateBeforeSave: false });

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private/Admin
exports.createLesson = async (req, res) => {
    try {
        const { title, description, category, price, duration, instructor } = req.body;
        let videoUrl = '';
        let thumbnailUrl = '';

        // Handle file uploads
        if (req.files) {
            if (req.files.video) {
                const videoResult = await uploadToCloudinary(req.files.video[0].path, 'stringz/lessons', 'video');
                videoUrl = videoResult.secure_url;
                fs.unlinkSync(req.files.video[0].path); // Remove from tmp
            }

            if (req.files.thumbnail) {
                const thumbResult = await uploadToCloudinary(req.files.thumbnail[0].path, 'stringz/thumbnails', 'image');
                thumbnailUrl = thumbResult.secure_url;
                fs.unlinkSync(req.files.thumbnail[0].path); // Remove from tmp
            }
        }

        const lesson = await Lesson.create({
            title,
            description,
            category,
            price: price || 99,
            duration,
            instructor,
            videoUrl,
            thumbnailUrl
        });

        res.status(201).json(lesson);
    } catch (error) {
        // Cleanup files if error
        if (req.files) {
            if (req.files.video) fs.unlinkSync(req.files.video[0].path);
            if (req.files.thumbnail) fs.unlinkSync(req.files.thumbnail[0].path);
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
exports.updateLesson = async (req, res) => {
    try {
        let lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Handle file updates if any
        if (req.files) {
            if (req.files.video) {
                const videoResult = await uploadToCloudinary(req.files.video[0].path, 'stringz/lessons', 'video');
                req.body.videoUrl = videoResult.secure_url;
                fs.unlinkSync(req.files.video[0].path);
            }

            if (req.files.thumbnail) {
                const thumbResult = await uploadToCloudinary(req.files.thumbnail[0].path, 'stringz/thumbnails', 'image');
                req.body.thumbnailUrl = thumbResult.secure_url;
                fs.unlinkSync(req.files.thumbnail[0].path);
            }
        }

        lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(lesson);
    } catch (error) {
        if (req.files) {
            if (req.files.video && fs.existsSync(req.files.video[0].path)) fs.unlinkSync(req.files.video[0].path);
            if (req.files.thumbnail && fs.existsSync(req.files.thumbnail[0].path)) fs.unlinkSync(req.files.thumbnail[0].path);
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
exports.deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        await lesson.deleteOne();
        res.json({ message: 'Lesson removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
