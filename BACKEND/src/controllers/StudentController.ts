import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { StudentService } from '../services/StudentService';

export class StudentController extends BaseController {
    private studentService: StudentService;

    constructor() {
        super();
        this.studentService = new StudentService();
    }

    public getPurchases = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return this.unauthorized(res, 'User not authenticated');
            }
            const result = await this.studentService.getPurchases(req.user.id);
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public getDashboard = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return this.unauthorized(res, 'User not authenticated');
            }
            const result = await this.studentService.getDashboard(req.user.id);
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public checkAccess = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return this.unauthorized(res, 'User not authenticated');
            }
            const { lessonId } = req.params;
            const hasAccess = await this.studentService.checkAccess(req.user.id, lessonId as string);
            return this.ok(res, { hasAccess });
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public updateProgress = async (req: Request, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                return this.unauthorized(res, 'User not authenticated');
            }
            const { lessonId, duration, position } = req.body;

            if (!lessonId) return this.clientError(res, 'Lesson ID is required');

            const result = await this.studentService.updateProgress(
                req.user.id,
                lessonId,
                duration || 0,
                position || 0
            );
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
