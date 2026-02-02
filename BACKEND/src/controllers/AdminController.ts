import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AdminService } from '../services/AdminService';

export class AdminController extends BaseController {
    private adminService: AdminService;

    constructor() {
        super();
        this.adminService = new AdminService();
    }

    public getStats = async (req: Request, res: Response) => {
        try {
            const result = await this.adminService.getStats();
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public getSales = async (req: Request, res: Response) => {
        try {
            const result = await this.adminService.getSales();
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const result = await this.adminService.getUsers();
            return this.ok(res, result);
        } catch (error: any) {
            return this.fail(res, error);
        }
    }

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.adminService.deleteUser(id as string);
            if (!result) return this.notFound(res, 'User not found');
            return this.ok(res, { message: 'User deleted' });
        } catch (error: any) {
            return this.fail(res, error);
        }
    }
}
