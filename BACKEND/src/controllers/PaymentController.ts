import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { PaymentService } from '../services/PaymentService';

export class PaymentController extends BaseController {
    private paymentService: PaymentService;

    constructor() {
        super();
        this.paymentService = new PaymentService();
    }

    public createOrder = async (req: Request, res: Response) => {
        try {
            const { lessonId } = req.body;
            const result = await this.paymentService.createOrder(lessonId);
            return this.ok(res, result);
        } catch (error: any) {
            if (error.message === 'Lesson not found') {
                return this.notFound(res, error.message);
            }
            return this.fail(res, error);
        }
    }

    public verifyPayment = async (req: Request, res: Response) => {
        try {
            // req.user set by auth middleware
            if (!req.user || !req.user.id) {
                return this.unauthorized(res, 'User not authenticated');
            }

            const result = await this.paymentService.verifyPayment(req.user.id, req.body);
            return this.ok(res, result);
        } catch (error: any) {
            if (error.message === 'Payment verification failed') {
                return this.clientError(res, error.message);
            }
            return this.fail(res, error);
        }
    }
}
