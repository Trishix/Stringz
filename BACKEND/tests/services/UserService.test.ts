import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { generateToken } from '../../src/utils/jwt';
import { OAuth2Client } from 'google-auth-library';

// Mock dependencies
jest.mock('../../src/repositories/UserRepository');
jest.mock('../../src/utils/jwt');
jest.mock('google-auth-library');

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockGenerateToken: jest.Mock;
    let mockOAuth2Client: any;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup mock implementations
        mockGenerateToken = generateToken as jest.Mock;
        mockGenerateToken.mockReturnValue('mock_token');

        // Mock OAuth2Client
        mockOAuth2Client = {
            verifyIdToken: jest.fn(),
        };
        (OAuth2Client as unknown as jest.Mock).mockImplementation(() => mockOAuth2Client);

        // Instantiate service
        userService = new UserService();

        // Access the private property mocks
        // Since we mocked the module, the instance creating in UserService is a mock
        mockUserRepository = (userService as any).userRepository;
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    describe('signup', () => {
        it('should create a new user and return auth response', async () => {
            const userData = { email: 'test@example.com', name: 'Test User', password: 'password123' };
            const createdUser = { ...userData, _id: 'user_id', role: 'student' };

            // Mock findByEmail to return null (user doesn't exist)
            mockUserRepository.findByEmail.mockResolvedValue(null);
            // Mock create to return the new user
            mockUserRepository.create.mockResolvedValue(createdUser as any);

            const result = await userService.signup(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
            expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
            expect(result).toEqual({
                token: 'mock_token',
                user: {
                    id: 'user_id',
                    name: userData.name,
                    email: userData.email,
                    role: 'student',
                    avatar: undefined,
                    purchases: undefined
                }
            });
        });

        it('should throw error if user already exists', async () => {
            const userData = { email: 'existing@example.com' };
            mockUserRepository.findByEmail.mockResolvedValue({ _id: 'existing_id' } as any);

            await expect(userService.signup(userData)).rejects.toThrow('User already exists');
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            const email = 'test@example.com';
            const password = 'password123';
            const user = {
                _id: 'user_id',
                email,
                name: 'Test',
                role: 'student',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            mockUserRepository.findByEmailWithPassword.mockResolvedValue(user as any);

            const result = await userService.login(email, password);

            expect(mockUserRepository.findByEmailWithPassword).toHaveBeenCalledWith(email);
            expect(user.comparePassword).toHaveBeenCalledWith(password);
            expect(result.token).toBe('mock_token');
        });

        it('should throw error if user not found', async () => {
            mockUserRepository.findByEmailWithPassword.mockResolvedValue(null);
            await expect(userService.login('wrong@email.com', 'pass')).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password does not match', async () => {
            const user = {
                comparePassword: jest.fn().mockResolvedValue(false)
            };
            mockUserRepository.findByEmailWithPassword.mockResolvedValue(user as any);
            await expect(userService.login('email@test.com', 'wrongpass')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('getMe', () => {
        it('should return user profile', async () => {
            const user = { _id: 'user_id', email: 'test@test.com' };
            mockUserRepository.findOne.mockResolvedValue(user as any);

            const result = await userService.getMe('user_id');
            expect(result).toEqual(user);
        });

        it('should throw error if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(userService.getMe('bad_id')).rejects.toThrow('User not found');
        });
    });

    describe('googleLogin', () => {
        const token = 'google_token';
        const payload = {
            email: 'google@test.com',
            name: 'Google User',
            picture: 'pic_url',
            sub: 'google_id'
        };

        it('should login existing user linked with google', async () => {
            mockOAuth2Client.verifyIdToken.mockResolvedValue({
                getPayload: () => payload
            });

            const user = {
                _id: 'user_id',
                email: payload.email,
                googleId: payload.sub,
                role: 'student',
                name: payload.name
            };
            mockUserRepository.findByEmail.mockResolvedValue(user as any);

            const result = await userService.googleLogin(token);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(payload.email);
            expect(result.token).toBe('mock_token');
        });

        it('should link google account to existing user if not linked', async () => {
            mockOAuth2Client.verifyIdToken.mockResolvedValue({
                getPayload: () => payload
            });

            const user = {
                _id: 'user_id',
                email: payload.email,
                googleId: undefined, // Not linked yet
                role: 'student',
                name: payload.name,
                avatar: undefined
            };
            mockUserRepository.findByEmail.mockResolvedValue(user as any);

            await userService.googleLogin(token);

            expect(mockUserRepository.update).toHaveBeenCalledWith('user_id', {
                googleId: payload.sub,
                avatar: payload.picture
            });
        });

        it('should create new user if not found', async () => {
            mockOAuth2Client.verifyIdToken.mockResolvedValue({
                getPayload: () => payload
            });

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.findByGoogleId.mockResolvedValue(null);

            const newUser = { _id: 'new_id', ...payload, role: 'student' };
            mockUserRepository.create.mockResolvedValue(newUser as any);

            await userService.googleLogin(token);

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email: payload.email,
                name: payload.name,
                googleId: payload.sub,
                avatar: payload.picture
            }));
        });

        it('should throw error if google token is invalid', async () => {
            mockOAuth2Client.verifyIdToken.mockResolvedValue({
                getPayload: () => null
            });

            await expect(userService.googleLogin(token)).rejects.toThrow('Invalid Google Token');
        });
    });
});
