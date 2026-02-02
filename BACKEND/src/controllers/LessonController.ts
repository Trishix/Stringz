import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { LessonService } from '../services/LessonService';

import redisService from '../services/RedisService';

export class LessonController extends BaseController {
    private lessonService: LessonService;

    constructor() {
        super();
        this.lessonService = new LessonService();
    }

    public getAllLessons = async (req: Request, res: Response) => {
        try {
            const cacheKey = `lessons:list:${JSON.stringify(req.query)}`;
            const cached = await redisService.get(cacheKey);

            if (cached) {
                return this.ok(res, JSON.parse(cached));
            }

            const result = await this.lessonService.getAllLessons(req.query);
            await redisService.set(cacheKey, JSON.stringify(result), 60); // Cache for 60s

            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public getLessonById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const cacheKey = `lesson:${id}`;
            const cached = await redisService.get(cacheKey);

            if (cached) {
                return this.ok(res, JSON.parse(cached));
            }

            const result = await this.lessonService.getLessonById(id as string);
            if (!result) {
                return this.notFound(res, 'Lesson not found');
            }

            await redisService.set(cacheKey, JSON.stringify(result), 3600); // Cache for 1 hour
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public createLesson = async (req: Request, res: Response) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const result = await this.lessonService.createLesson(req.body, files);

            // Invalidate list cache (simplistic approach: just one known key or rely on TTL)
            // Ideally we'd scan and delete lessons:list:* but simple TTL is often preferred for lists

            return this.created(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public updateLesson = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const result = await this.lessonService.updateLesson(id as string, req.body, files);
            if (!result) {
                return this.notFound(res, 'Lesson not found');
            }

            // Invalidate specific lesson cache
            await redisService.del(`lesson:${id}`);

            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public deleteLesson = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.lessonService.deleteLesson(id as string);
            if (!result) {
                return this.notFound(res, 'Lesson not found');
            }

            // Invalidate specific lesson cache
            await redisService.del(`lesson:${id}`);

            return this.ok(res, { message: 'Lesson removed' });
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
