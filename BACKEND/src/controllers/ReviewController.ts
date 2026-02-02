import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ReviewService } from '../services/ReviewService';

export class ReviewController extends BaseController {
    private reviewService: ReviewService;

    constructor() {
        super();
        this.reviewService = new ReviewService();
    }

    public getLessonReviews = async (req: Request, res: Response) => {
        try {
            const { lessonId } = req.params;
            const result = await this.reviewService.getLessonReviews(lessonId as string);
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public createReview = async (req: Request, res: Response) => {
        try {
            if (!req.user) return this.unauthorized(res, 'Unauthorized');

            const { lessonId, rating, comment } = req.body;
            const result = await this.reviewService.createReview({
                lessonId,
                userId: req.user.id,
                rating,
                comment
            } as any); // Cast because creating with partial
            return this.created(res, result);
        } catch (error: any) {
            if (error.message === 'You have already reviewed this lesson') {
                return this.clientError(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public updateReview = async (req: Request, res: Response) => {
        try {
            if (!req.user) return this.unauthorized(res, 'Unauthorized');

            const { id } = req.params;
            const result = await this.reviewService.updateReview(id as string, req.user.id, req.body);

            if (!result) return this.notFound(res, 'Review not found'); // Could also mean not authorized if it threw, but service throws 'Not authorized'

            return this.ok(res, result);
        } catch (error: any) {
            if (error.message === 'Not authorized') {
                return this.unauthorized(res, error.message);
            }
            if (error.message === 'Review not found') { // If verify logic was different
                return this.notFound(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public deleteReview = async (req: Request, res: Response) => {
        try {
            if (!req.user) return this.unauthorized(res, 'Unauthorized');

            const { id } = req.params;
            const result = await this.reviewService.deleteReview(id as string, req.user.id, req.user.role);

            if (!result) return this.notFound(res, 'Review not found'); // Unless it threw authorized error

            return this.ok(res, { message: 'Review removed' });
        } catch (error: any) {
            if (error.message === 'Not authorized') {
                return this.unauthorized(res, error.message);
            }
            return this.fail(res, error);
        }
    }
}
