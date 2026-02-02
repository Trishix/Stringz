import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
