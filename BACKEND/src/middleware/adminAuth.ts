import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import Logger from '../utils/Logger';

// Extend Request type if not globally available, but let's assume global augmentation works or use casting
// Ideally, we should ensure Request.user is typed. 
// For now, I'll use explicit casting or access req.user if TS allows.

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // We could just check req.user.role if loaded, but verifying against DB is safer as per original logic
        const userRepository = new UserRepository();
        const user = await userRepository.findOne(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        next();
    } catch (error) {
        Logger.error(`Admin Auth Error: ${error}`);
        res.status(500).json({ message: 'Server error during authorization' });
    }
};

export default adminAuth;
