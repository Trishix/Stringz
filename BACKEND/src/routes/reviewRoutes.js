const express = require('express');
const router = express.Router();
const {
    getLessonReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/lesson/:lessonId', getLessonReviews);
router.post('/', auth, createReview);
router.put('/:id', auth, updateReview);
router.delete('/:id', auth, deleteReview);

module.exports = router;
