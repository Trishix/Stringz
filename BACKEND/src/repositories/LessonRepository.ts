import { BaseRepository } from './BaseRepository';
import Lesson, { ILesson } from '../models/Lesson';

export class LessonRepository extends BaseRepository<ILesson> {
    constructor() {
        super(Lesson);
    }

    // Add specific query methods if needed
    async findByCategory(category: string, limit: number = 10, skip: number = 0): Promise<ILesson[]> {
        return this._model.find({ category, isPublished: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async findPopular(limit: number = 10): Promise<ILesson[]> {
        return this._model.find({ isPublished: true })
            .sort({ popularity: -1 })
            .limit(limit);
    }

    async getAdvancedLessons(filter: any, sortOption: any, skip: number, limit: number): Promise<{ lessons: ILesson[], total: number }> {
        const lessons = await this._model.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const total = await this._model.countDocuments(filter);
        return { lessons, total };
    }
}
