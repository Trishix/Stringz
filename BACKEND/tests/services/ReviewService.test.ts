import { ReviewService } from '../../src/services/ReviewService';
import { ReviewRepository } from '../../src/repositories/ReviewRepository';

// Mock dependencies
jest.mock('../../src/repositories/ReviewRepository');

describe('ReviewService', () => {
    let reviewService: ReviewService;
    let mockReviewRepository: jest.Mocked<ReviewRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        reviewService = new ReviewService();

        // Access private property
        mockReviewRepository = (reviewService as any).reviewRepository;
    });

    describe('getLessonReviews', () => {
        it('should return list of reviews', async () => {
            const lessonId = 'lesson1';
            const mockReviews = [
                { comment: 'Great!', rating: 5, userId: { name: 'Student' } }
            ];

            mockReviewRepository.findByLesson.mockResolvedValue(mockReviews as any);

            const result = await reviewService.getLessonReviews(lessonId);

            expect(mockReviewRepository.findByLesson).toHaveBeenCalledWith(lessonId);
            expect(result).toBe(mockReviews);
        });
    });

    describe('createReview', () => {
        it('should create and populate a review', async () => {
            const reviewData = { lessonId: 'l1', userId: 'u1', rating: 5, comment: 'Nice' };
            const mockCreatedReview = {
                ...reviewData,
                _id: 'r1',
                populate: jest.fn()
            };

            mockReviewRepository.create.mockResolvedValue(mockCreatedReview as any);

            const result = await reviewService.createReview(reviewData as any);

            expect(mockReviewRepository.create).toHaveBeenCalledWith(reviewData);
            expect(mockCreatedReview.populate).toHaveBeenCalledWith('userId', 'name');
            expect(result).toBe(mockCreatedReview);
        });

        it('should throw error if duplicate review', async () => {
            const reviewData = { lessonId: 'l1' };
            const error = new Error('Duplicate') as any;
            error.code = 11000;

            mockReviewRepository.create.mockRejectedValue(error);

            await expect(reviewService.createReview(reviewData as any))
                .rejects.toThrow('You have already reviewed this lesson');
        });
    });

    describe('updateReview', () => {
        it('should update own review', async () => {
            const reviewId = 'r1';
            const userId = 'u1';
            const updates = { rating: 4 };

            const mockExisting = { _id: reviewId, userId: 'u1' }; // Matching ID
            const mockUpdated = { ...mockExisting, rating: 4, populate: jest.fn() };

            mockReviewRepository.findOne.mockResolvedValue(mockExisting as any);
            mockReviewRepository.update.mockResolvedValue(mockUpdated as any);

            const result = await reviewService.updateReview(reviewId, userId, updates as any);

            expect(result).toBe(mockUpdated);
            expect(mockUpdated.populate).toHaveBeenCalled();
        });

        it('should throw if not authorized', async () => {
            const reviewId = 'r1';
            const userId = 'u2'; // Different user

            mockReviewRepository.findOne.mockResolvedValue({ _id: reviewId, userId: 'u1' } as any);

            await expect(reviewService.updateReview(reviewId, userId, {}))
                .rejects.toThrow('Not authorized');
        });
    });

    describe('deleteReview', () => {
        it('should delete own review', async () => {
            mockReviewRepository.findOne.mockResolvedValue({ _id: 'r1', userId: 'u1' } as any);
            mockReviewRepository.delete.mockResolvedValue(true);

            const result = await reviewService.deleteReview('r1', 'u1', 'student');
            expect(result).toBe(true);
        });

        it('should allow admin to delete any review', async () => {
            mockReviewRepository.findOne.mockResolvedValue({ _id: 'r1', userId: 'u1' } as any);
            mockReviewRepository.delete.mockResolvedValue(true);

            const result = await reviewService.deleteReview('r1', 'admin_id', 'admin');
            expect(result).toBe(true);
        });

        it('should prohibit other users from deleting', async () => {
            mockReviewRepository.findOne.mockResolvedValue({ _id: 'r1', userId: 'u1' } as any);

            await expect(reviewService.deleteReview('r1', 'u2', 'student'))
                .rejects.toThrow('Not authorized');
        });
    });
});
