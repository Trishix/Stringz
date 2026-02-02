import { LessonRepository } from '../repositories/LessonRepository';
import { CloudinaryService } from './CloudinaryService';
import { ILesson } from '../models/Lesson';
import fs from 'fs';

export class LessonService {
    private lessonRepository: LessonRepository;

    constructor() {
        this.lessonRepository = new LessonRepository();
    }

    async getAllLessons(query: any) {
        const { search, category, sort, page = 1, limit = 10 } = query;
        const filter: any = { isPublished: true };

        if (search) {
            filter.$text = { $search: search };
        }

        if (category && category !== 'All') {
            filter.category = category.toLowerCase();
        }

        const skip = (Number(page) - 1) * Number(limit);
        let sortOption: any = { createdAt: -1 };

        if (sort === 'popular') sortOption = { popularity: -1 };
        if (sort === 'price_low') sortOption = { price: 1 };
        if (sort === 'price_high') sortOption = { price: -1 };

        const { lessons, total } = await this.lessonRepository.getAdvancedLessons(filter, sortOption, skip, Number(limit));

        return {
            lessons,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        };
    }

    async createLesson(data: Partial<ILesson>, files: any): Promise<ILesson> {
        let videoUrl = '';
        let thumbnailUrl = '';

        if (files) {
            if (files.video) {
                const videoResult = await CloudinaryService.upload(files.video[0].path, 'stringz/lessons', 'video');
                videoUrl = videoResult.secure_url;
                try { fs.unlinkSync(files.video[0].path); } catch (e) { }
            }

            if (files.thumbnail) {
                const thumbResult = await CloudinaryService.upload(files.thumbnail[0].path, 'stringz/thumbnails', 'image');
                thumbnailUrl = thumbResult.secure_url;
                try { fs.unlinkSync(files.thumbnail[0].path); } catch (e) { }
            }
        }

        const lessonData = {
            ...data,
            videoUrl,
            thumbnailUrl,
            price: data.price || 99
        };

        return this.lessonRepository.create(lessonData as ILesson);
    }

    async getLessonById(id: string): Promise<ILesson | null> {
        const lesson = await this.lessonRepository.findOne(id);
        if (lesson) {
            // Increment popularity
            const newPopularity = (lesson.popularity || 0) + 1;
            await this.lessonRepository.update(id, { popularity: newPopularity });
        }
        return lesson;
    }

    async updateLesson(id: string, data: Partial<ILesson>, files: any): Promise<ILesson | null> {
        const existingLesson = await this.lessonRepository.findOne(id);
        if (!existingLesson) return null;

        let updates: any = { ...data };

        if (files) {
            if (files.video) {
                const videoResult = await CloudinaryService.upload(files.video[0].path, 'stringz/lessons', 'video');
                updates.videoUrl = videoResult.secure_url;
                try { fs.unlinkSync(files.video[0].path); } catch (e) { }
            }
            if (files.thumbnail) {
                const thumbResult = await CloudinaryService.upload(files.thumbnail[0].path, 'stringz/thumbnails', 'image');
                updates.thumbnailUrl = thumbResult.secure_url;
                try { fs.unlinkSync(files.thumbnail[0].path); } catch (e) { }
            }
        }

        return this.lessonRepository.update(id, updates);
    }

    async deleteLesson(id: string): Promise<boolean> {
        return this.lessonRepository.delete(id);
    }
}
