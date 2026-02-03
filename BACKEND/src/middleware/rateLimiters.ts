import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisService from '../services/RedisService';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-expect-error - Redis client type mismatch in some versions but works at runtime
        sendCommand: (...args: string[]) => RedisService.getClient().call(...args),
    }),
    message: {
        message: 'Too many login attempts, please try again after 15 minutes'
    }
});
