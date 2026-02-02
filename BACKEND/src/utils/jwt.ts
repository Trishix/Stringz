import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || '7d') as any
    };
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'mysecretkey', options);
};
