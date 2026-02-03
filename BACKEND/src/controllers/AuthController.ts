import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';
import Logger from '../utils/Logger';

export class AuthController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    public signup = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.signup(req.body);
            return this.created(res, result);
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return this.clientError(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            Logger.info(`Login request: ${req.body.email}`);
            const { email, password } = req.body;
            const result = await this.userService.login(email, password);
            Logger.info('Login success');
            return this.ok(res, result);
        } catch (error: any) {
            Logger.error(`Login error: ${error.message}`);
            if (error.message === 'Invalid credentials') {
                return this.clientError(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public getMe = async (req: Request, res: Response) => {
        try {
            const userId = req.user.id;
            const user = await this.userService.getMe(userId);
            return this.ok(res, user);
        } catch (error: any) {
            Logger.error(`GetMe error: ${error.message}`);
            if (error.message === 'User not found') {
                return this.notFound(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public googleLogin = async (req: Request, res: Response) => {
        try {
            Logger.info('Google login request');
            const { token } = req.body;
            const result = await this.userService.googleLogin(token);
            Logger.info('Google login success');
            return this.ok(res, result);
        } catch (error) {
            Logger.error(`Google login error: ${error}`);
            return this.fail(res, error as Error);
        }
    }
}
