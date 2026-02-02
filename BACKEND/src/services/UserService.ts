import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { OAuth2Client } from 'google-auth-library';
// Note: We need to migrate utils/jwt.js to TS as well, but for now we'll assumes it works or will be migrated next.

export class UserService {
    private userRepository: UserRepository;
    private googleClient: OAuth2Client;

    constructor() {
        this.userRepository = new UserRepository();
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async signup(userData: Partial<IUser>) {
        const existingUser = await this.userRepository.findByEmail(userData.email!);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await this.userRepository.create(userData);
        return this.generateAuthResponse(user);
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return this.generateAuthResponse(user);
    }

    async getMe(userId: string) {
        const user = await this.userRepository.findOne(userId);
        if (!user) throw new Error('User not found');
        return user;
    }

    async googleLogin(token: string) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) throw new Error('Invalid Google Token');

        const { name, email, picture, sub: googleId } = payload;

        let user = await this.userRepository.findByEmail(email);

        // Check by googleId if not found by email (edge case)
        if (!user) {
            user = await this.userRepository.findByGoogleId(googleId);
        }

        if (user) {
            if (!user.googleId) {
                // Link google account
                await this.userRepository.update(user._id as string, { googleId, avatar: user.avatar || picture });
            }
        } else {
            // Create new user
            const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = await this.userRepository.create({
                name,
                email,
                googleId,
                avatar: picture,
                password
            } as Partial<IUser>);
        }

        return this.generateAuthResponse(user);
    }

    private generateAuthResponse(user: IUser) {
        const token = generateToken(user._id as string, user.role);
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                purchases: user.purchases
            }
        };
    }
}
