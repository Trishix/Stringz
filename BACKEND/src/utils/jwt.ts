import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id: userId, role }, secret, options);
};
