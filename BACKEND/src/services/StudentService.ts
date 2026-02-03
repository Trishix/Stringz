import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { IUser } from '../models/User';
import UserProgress from '../models/UserProgress';

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
        return this.userRepository.getPurchases(userId);
    }

    async getDashboard(userId: string) {
        // 1. Handle Daily Activity & Coins
        const user = await this.userRepository.findById(userId);
        if (user) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Check if active today
            const lastActive = user.activeDates.length > 0
                ? new Date(user.activeDates[user.activeDates.length - 1])
                : null;

            if (lastActive) lastActive.setHours(0, 0, 0, 0);

            if (!lastActive || lastActive.getTime() !== today.getTime()) {
                user.activeDates.push(today);
                user.coins = (user.coins || 0) + 10; // Daily reward
                await user.save();
            }
        }

        // 2. Calculate Streak
        let currentStreak = 0;
        if (user && user.activeDates && user.activeDates.length > 0) {
            const sortedDates = [...user.activeDates].map(d => new Date(d).setHours(0, 0, 0, 0)).sort((a, b) => b - a);
            const today = new Date().setHours(0, 0, 0, 0);
            const yesterday = new Date(today - 86400000).setHours(0, 0, 0, 0);

            // If active today, start streak from 1. If not (shouldn't happen due to above), start 0.
            // Actually, we iterate backwards.
            let lastDate = sortedDates[0];

            if (lastDate === today || lastDate === yesterday) {
                currentStreak = 1;
                for (let i = 1; i < sortedDates.length; i++) {
                    const prevDate = sortedDates[i];
                    const expectedPrev = lastDate - 86400000;
                    if (prevDate === expectedPrev) {
                        currentStreak++;
                        lastDate = prevDate;
                    } else {
                        break;
                    }
                }
            }
        }

        const purchases = await this.userRepository.getPurchases(userId);
        const transactions = await this.transactionRepository.findByUser(userId);
        const completedTransactions = transactions.filter(t => t.status === 'completed');

        const totalSpent = completedTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        // Calculate total learning time
        const progress = await UserProgress.find({ user: userId });
        const totalSeconds = progress.reduce((acc, curr) => acc + curr.watchedDuration, 0);
        const totalLearningTime = Math.round(totalSeconds / 3600); // Hours

        return {
            purchaseCount: purchases.length,
            totalSpent,
            totalLearningTime,
            recentLessons: purchases.slice(-3),
            coins: user?.coins || 0,
            streak: currentStreak,
            activeDates: user?.activeDates || []
        };
    }

    async checkAccess(userId: string, lessonId: string): Promise<boolean> {
        const user = await this.userRepository.findOne(userId);
        if (!user) return false;
        const purchases = user.purchases;
        return purchases.some(p => p.toString() === lessonId.toString());
    }

    async updateProgress(userId: string, lessonId: string, duration: number, position: number) {
        // duration is incremental watched seconds in this session delta
        // position is current timestamp

        let progress = await UserProgress.findOne({ user: userId, lesson: lessonId });

        if (!progress) {
            progress = await UserProgress.create({
                user: userId,
                lesson: lessonId,
                watchedDuration: 0,
                lastPosition: 0
            });
        }

        progress.watchedDuration += duration;
        progress.lastPosition = position;
        await progress.save();
        return progress;
    }
}
