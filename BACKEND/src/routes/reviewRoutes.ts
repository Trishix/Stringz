import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { auth } from '../middleware/auth';

const router = Router();
const reviewController = new ReviewController();

router.get('/lesson/:lessonId', reviewController.getLessonReviews);
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

export default router;
