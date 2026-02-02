import { BaseRepository } from './BaseRepository';
import Review, { IReview } from '../models/Review';

export class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(Review);
    }

    async findByLesson(lessonId: string): Promise<IReview[]> {
        return this._model.find({ lessonId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
    }
}
