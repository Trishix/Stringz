const express = require('express');
const router = express.Router();
const {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
} = require('../controllers/lessonController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const { validateLesson, handleValidationErrors } = require('../utils/validators');

router.get('/', getAllLessons);
router.get('/:id', getLessonById);

router.post('/',
    auth,
    adminAuth,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    // validateLesson, // Validation is tricky with FormData + Multer before body parsing, skipping middleware validation for files
    createLesson
);

router.put('/:id',
    auth,
    adminAuth,
    upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]),
    updateLesson
);

router.delete('/:id', auth, adminAuth, deleteLesson);

module.exports = router;
