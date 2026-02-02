import { RazorpayService } from './RazorpayService';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { ITransaction } from '../models/Transaction';

export class PaymentService {
    private razorpayService: RazorpayService;
    private transactionRepository: TransactionRepository;
    private userRepository: UserRepository;
    private lessonRepository: LessonRepository;

    constructor() {
        this.razorpayService = new RazorpayService();
        this.transactionRepository = new TransactionRepository();
        this.userRepository = new UserRepository();
        this.lessonRepository = new LessonRepository();
    }

    async createOrder(lessonId: string): Promise<any> {
        const lesson = await this.lessonRepository.findOne(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }

        const amount = lesson.price * 100; // currency in subunits (paisa)
        const receipt = `receipt_${Date.now()}`;

        const order = await this.razorpayService.createOrder(amount, 'INR', receipt);
        return order;
    }

    async verifyPayment(userId: string, data: { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, lessonId: string }): Promise<{ success: boolean, message: string }> {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, lessonId } = data;

        const isAuthentic = this.razorpayService.verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isAuthentic) {
            throw new Error('Payment verification failed');
        }

        const lesson = await this.lessonRepository.findOne(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }

        // 1. Create Transaction
        await this.transactionRepository.create({
            userId: userId as any, // Cast for mongoose id compatibility
            lessonId: lessonId as any,
            amount: lesson.price,
            status: 'completed',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
        } as unknown as ITransaction);

        // 2. Add to User Purchases
        // Need to update User model to store purchases if not already
        // Legacy controller used: User.findByIdAndUpdate(req.user.id, { $addToSet: { purchases: lessonId } });
        // UserRepository needs a method for this or use update.
        // BaseRepo.update takes UpdateQuery.
        // But Mongoose Types might conflict.
        // Let's create a specific method in UserRepository or use update with $addToSet.
        // Note: IUser interface might need 'purchases' field.

        // I'll call a specific method on UserRepository to be safe, or just use update.
        // But I need to define 'purchases' on IUser if not present.
        // I will assume for now I can cast or extend.

        await this.userRepository.addPurchase(userId, lessonId);

        // 3. Increment Sales Count
        lesson.salesCount = (lesson.salesCount || 0) + 1;
        await this.lessonRepository.update(lessonId, { salesCount: lesson.salesCount });

        return { success: true, message: 'Payment successful' };
    }
}
