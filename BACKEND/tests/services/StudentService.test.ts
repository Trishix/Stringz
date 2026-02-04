import { StudentService } from '../../src/services/StudentService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { TransactionRepository } from '../../src/repositories/TransactionRepository';
import UserProgress from '../../src/models/UserProgress';

// Mock dependencies
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/repositories/TransactionRepository');
jest.mock('../../src/repositories/LessonRepository');
jest.mock('../../src/models/UserProgress');

describe('StudentService', () => {
    let studentService: StudentService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockTransactionRepository: jest.Mocked<TransactionRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        studentService = new StudentService();

        mockUserRepository = (studentService as any).userRepository;
        mockTransactionRepository = (studentService as any).transactionRepository;
    });

    describe('getDashboard', () => {
        it('should return dashboard data with correct learning time and streak', async () => {
            const userId = 'user123';

            // Explicitly set dates to avoid timing issues
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const mockUser = {
                _id: userId,
                coins: 100,
                // Provide both dates. markDailyActivity will see "today" as last active and won't add it again.
                // Coins won't increment. Streak should be 2.
                activeDates: [yesterday, today],
                save: jest.fn()
            };

            const mockPurchases = [{ title: 'Lesson 1' }];
            const mockTransactions = [{ status: 'completed', amount: 500 }];
            const mockProgress = [{ watchedDuration: 300 }, { watchedDuration: 300 }];

            mockUserRepository.findOne.mockResolvedValue(mockUser as any);
            mockUserRepository.getPurchases.mockResolvedValue(mockPurchases as any);
            mockTransactionRepository.findByUser.mockResolvedValue(mockTransactions as any);
            (UserProgress.find as jest.Mock).mockResolvedValue(mockProgress);

            const result = await studentService.getDashboard(userId);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);

            expect(result).toMatchObject({
                purchaseCount: 1,
                totalSpent: 500,
                totalLearningTime: 10,
                coins: 100, // No new daily reward as 'today' is already in activeDates
                streak: 2
            });
        });
    });

    describe('checkAccess', () => {
        it('should return true if user owns the lesson', async () => {
            const userId = 'user1';
            const lessonId = 'lesson1';
            const mockUser = {
                _id: userId,
                purchases: ['lesson1', 'lesson2']
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            const hasAccess = await studentService.checkAccess(userId, lessonId);
            expect(hasAccess).toBe(true);
        });

        it('should return false if user does not own the lesson', async () => {
            const userId = 'user1';
            const lessonId = 'lesson3';
            const mockUser = {
                _id: userId,
                purchases: ['lesson1']
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            const hasAccess = await studentService.checkAccess(userId, lessonId);
            expect(hasAccess).toBe(false);
        });
    });

    describe('updateProgress', () => {
        it('should create new progress if not exists and mark activity', async () => {
            const userId = 'user1';
            const lessonId = 'lesson1';

            (UserProgress.findOne as jest.Mock).mockResolvedValue(null);

            const mockSave = jest.fn();
            const mockProgressInstance = {
                watchedDuration: 0,
                save: mockSave
            };
            (UserProgress.create as jest.Mock).mockResolvedValue(mockProgressInstance);

            const mockUser = {
                _id: userId,
                activeDates: [],
                save: jest.fn()
            };
            mockUserRepository.findOne.mockResolvedValue(mockUser as any);

            await studentService.updateProgress(userId, lessonId, 60, 100);

            expect(UserProgress.create).toHaveBeenCalledWith(expect.objectContaining({
                user: userId,
                lesson: lessonId
            }));

            expect(mockProgressInstance.watchedDuration).toBe(60);
            expect(mockSave).toHaveBeenCalled();
            expect(mockUserRepository.findOne).toHaveBeenCalledWith(userId);
        });

        it('should update existing progress', async () => {
            const userId = 'user1';
            const lessonId = 'lesson1';

            const mockSave = jest.fn();
            const mockExistingProgress = {
                watchedDuration: 100,
                lastPosition: 50,
                save: mockSave
            };
            (UserProgress.findOne as jest.Mock).mockResolvedValue(mockExistingProgress);
            mockUserRepository.findOne.mockResolvedValue({ activeDates: [], save: jest.fn() } as any);

            await studentService.updateProgress(userId, lessonId, 30, 200);

            expect(mockExistingProgress.watchedDuration).toBe(130);
            expect(mockExistingProgress.lastPosition).toBe(200);
            expect(mockSave).toHaveBeenCalled();
        });
    });
});
