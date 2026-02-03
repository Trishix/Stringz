import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class RedisService {
    private static instance: RedisService;
    private redis: Redis;

    private constructor() {
        // Use REDIS_URL from env or default to localhost
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        console.log(`Attempting to connect to Redis at: ${redisUrl.includes('@') ? redisUrl.split('@')[1] : redisUrl}`);
        this.redis = new Redis(redisUrl, {
            // Retry strategy
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3
        });

        this.redis.on('connect', () => {
            console.log('✅ Redis Connected');
        });

        this.redis.on('error', (err) => {
            console.error('❌ Redis Connection Error:', err);
        });
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public getClient(): Redis {
        return this.redis;
    }

    public async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    public async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
        await this.redis.set(key, value, 'EX', ttlSeconds);
    }

    public async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
}

export default RedisService.getInstance();
