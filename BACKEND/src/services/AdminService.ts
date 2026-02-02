import { UserRepository } from '../repositories/UserRepository';
import { LessonRepository } from '../repositories/LessonRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import Transaction from '../models/Transaction'; // Using Model directly for complex aggregation if Repository doesn't support it

export class AdminService {
    private userRepository: UserRepository;
    private lessonRepository: LessonRepository;
    private transactionRepository: TransactionRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.lessonRepository = new LessonRepository();
        this.transactionRepository = new TransactionRepository();
    }

    async getStats() {
        // We can add count methods to Repositories or use underlying model. 
        // For clean architecture, Repos should have count() or similar. 
        // But for Admin stats which are specific, I might use direct model access or add `count` to generic repo.
        // BaseRepository usually has generic methods. I'll check BaseRepository capabilities or use direct model access via repo if exposed, or just new Repo methods.
        // Let's add simple count methods to Repositories or access via `_model` if I made it public/protected. 
        // `_model` IS protected. I can extend Repos.
        // Or I can just instantiate models? No, stick to Repo pattern.
        // I will add `count(filter)` to BaseRepository? 
        // For now, I will use a workaround: cast repo to any to access model or add specific methods.
        // Actually, simplest is to add specific methods to Repos like `countStudents`.

        // However, to save time on modifying all Repos, I will access the models via import for Stats since it's "Admin" super privilege.
        // Ideally, AdminService should usage Repos. I'll try to stick to it.
        // TransactionRepository.count({ status: 'completed' }) -> needs implementation.

        // I'll implement it properly: AdminService imports models directly for Stats Aggregation?
        // It's acceptable for complex aggregating services to use Query Builder or Models directly if Repo is too generic.
        // Let's import Models for the aggregation parts.

        const { default: User } = await import('../models/User');
        const { default: Lesson } = await import('../models/Lesson');
        const { default: Transaction } = await import('../models/Transaction');

        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalLessons = await Lesson.countDocuments();
        const totalTransactions = await Transaction.countDocuments({ status: 'completed' });

        const transactions = await Transaction.find({ status: 'completed' });
        const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

        return {
            totalUsers,
            totalLessons,
            totalTransactions,
            totalRevenue
        };
    }

    async getSales() {
        const { default: Transaction } = await import('../models/Transaction');

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const sales = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return sales;
    }

    async getUsers() {
        // This can be done via UserRepository
        // Need findAll with select.
        // BaseRepo find returns entire object.
        // I'll use UserRepository directly or Model.
        // Let's use UserRepository. I'll add `findAllUsers`?
        // Or just use Model for bulk admin fetch.
        const { default: User } = await import('../models/User');
        return User.find().select('-password');
    }

    async deleteUser(userId: string) {
        return this.userRepository.delete(userId);
    }
}
