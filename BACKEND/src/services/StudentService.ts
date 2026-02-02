import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { IUser } from '../models/User';

export class StudentService {
    private userRepository: UserRepository;
    private transactionRepository: TransactionRepository;
    private lessonRepository: LessonRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.transactionRepository = new TransactionRepository();
        this.lessonRepository = new LessonRepository();
    }

    async getPurchases(userId: string) {
        // We need to populate purchases. 
        // Since BaseRepository doesn't support populate easily, we'll access model directly via a specific method in UserRepository
        return this.userRepository.getPurchases(userId);
    }

    async getDashboard(userId: string) {
        const purchases = await this.userRepository.getPurchases(userId);
        const transactions = await this.transactionRepository.findByUser(userId);
        // Filter for completed transactions if needed, but findByUser returns all. 
        // TransactionRepo needs findByStatus? Or just filter here.
        const completedTransactions = transactions.filter(t => t.status === 'completed');

        const totalSpent = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            purchaseCount: purchases.length,
            totalSpent,
            recentLessons: purchases.slice(-3)
        };
    }

    async checkAccess(userId: string, lessonId: string): Promise<boolean> {
        const user = await this.userRepository.findOne(userId);
        if (!user) return false;
        // Check if lessonId is in purchases. Purchases is array of ObjectIds (or populated objects if we populated).
        // findOne returns generic document.
        // We need to check if purchases array contains lessonId.
        // user.purchases might be strings or ObjectIds.
        // We should cast or use string comparison.

        const purchases = user.purchases as any[]; // TODO: Define strict type for purchases in IUser
        return purchases.some(p => p.toString() === lessonId.toString());
    }
}
