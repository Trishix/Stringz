import request from 'supertest';
import app from '../../src/app';
import { UserService } from '../../src/services/UserService';

// Mock Mongoose to avoid connection errors
jest.mock('mongoose', () => ({
    connect: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn().mockResolvedValue(true),
    Schema: class { },
    model: jest.fn(),
}));

// Mock UserService
jest.mock('../../src/services/UserService');

// Mock Auth Middleware to bypass token check
jest.mock('../../src/middleware/auth', () => ({
    auth: (req: any, res: any, next: any) => {
        req.user = { id: 'user_id', role: 'student' }; // Mock user attached by middleware
        next();
    }
}));

const mockUserService = UserService as jest.MockedClass<typeof UserService>;

describe('Auth Routes', () => {
    let userServiceMockInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Ensure mock instance has the methods mocked
        userServiceMockInstance = {
            signup: jest.fn(),
            login: jest.fn(),
            getMe: jest.fn(),
            googleLogin: jest.fn()
        };

        mockUserService.mockImplementation(() => userServiceMockInstance);
    });

    describe('POST /api/auth/signup', () => {
        it('should return 201 and token on successful signup', async () => {
            const mockResponse = { token: 'abc', user: { id: '1', email: 'test@test.com' } };
            userServiceMockInstance.signup.mockResolvedValue(mockResponse);

            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockResponse);
            expect(userServiceMockInstance.signup).toHaveBeenCalled();
        });

        it('should return 400 validation error', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: '',
                    email: 'bad-email',
                });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
            // UserService should not be called
            expect(userServiceMockInstance.signup).not.toHaveBeenCalled();
        });

        it('should return 400 if user exists', async () => {
            userServiceMockInstance.signup.mockRejectedValue(new Error('User already exists'));

            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: 'Test',
                    email: 'exists@test.com',
                    password: 'pass'
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 and token on success', async () => {
            const mockResponse = { token: 'abc', user: { id: '1' } };
            userServiceMockInstance.login.mockResolvedValue(mockResponse);

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'pass' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockResponse);
        });

        it('should return 400 on invalid credentials', async () => {
            userServiceMockInstance.login.mockRejectedValue(new Error('Invalid credentials'));

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'wrong' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return 200 and user profile', async () => {
            const mockUser = { id: 'user_id', email: 'test@test.com' };
            userServiceMockInstance.getMe.mockResolvedValue(mockUser);

            const res = await request(app).get('/api/auth/me');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockUser);
            expect(userServiceMockInstance.getMe).toHaveBeenCalledWith('user_id');
        });

        it('should return 404 if user not found', async () => {
            userServiceMockInstance.getMe.mockRejectedValue(new Error('User not found'));
            const res = await request(app).get('/api/auth/me');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        });
    });

    describe('POST /api/auth/google', () => {
        it('should return 200 and token on success', async () => {
            const mockResponse = { token: 'gtoken', user: {} };
            userServiceMockInstance.googleLogin.mockResolvedValue(mockResponse);

            const res = await request(app)
                .post('/api/auth/google')
                .send({ token: 'xyz' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockResponse);
        });
    });
});
