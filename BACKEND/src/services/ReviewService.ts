import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReview } from '../models/Review';

export class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    async getLessonReviews(lessonId: string) {
        return this.reviewRepository.findByLesson(lessonId);
    }

    async createReview(data: Partial<IReview>): Promise<IReview> {
        try {
            const review = await this.reviewRepository.create(data);
            await review.populate('userId', 'name');
            return review;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new Error('You have already reviewed this lesson');
            }
            throw error;
        }
    }

    async updateReview(id: string, userId: string, data: Partial<IReview>): Promise<IReview | null> {
        const review = await this.reviewRepository.findOne(id);
        if (!review) return null;

        if (review.userId.toString() !== userId) {
            throw new Error('Not authorized');
        }

        const updated = await this.reviewRepository.update(id, data);
        if (updated) {
            await updated.populate('userId', 'name');
        }
        return updated;
    }

    async deleteReview(id: string, userId: string, userRole: string): Promise<boolean> {
        const review = await this.reviewRepository.findOne(id);
        if (!review) return false;

        if (review.userId.toString() !== userId && userRole !== 'admin') {
            throw new Error('Not authorized');
        }

        return this.reviewRepository.delete(id);
    }
}
