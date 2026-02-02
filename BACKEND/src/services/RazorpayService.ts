import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export class RazorpayService {
    private instance: any; // Type 'any' because strict typing for Razorpay instance can be tricky or needs generic 'Razorpay' type

    constructor() {
        this.instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
        });
    }

    public async createOrder(amount: number, currency: string = 'INR', receipt: string): Promise<any> {
        const options = {
            amount: amount, // amount in the smallest currency unit
            currency,
            receipt
        };
        return this.instance.orders.create(options);
    }

    public verifySignature(orderId: string, paymentId: string, signature: string): boolean {
        const secret = process.env.RAZORPAY_KEY_SECRET || 'test_key_secret';
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    }
}
