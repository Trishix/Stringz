import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import mongoSanitize from 'express-mongo-sanitize';
import { mongoSanitize } from './middleware/mongoSanitize';
// xss-clean types might be missing, assuming handled or ignored in server.ts previously
// import xss from 'xss-clean'; 
import rateLimit from 'express-rate-limit';
// @ts-ignore
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import Logger from './utils/Logger';

// Import Routes
import authRoutes from './routes/authRoutes';
import lessonRoutes from './routes/lessonRoutes';
import paymentRoutes from './routes/paymentRoutes';
import studentRoutes from './routes/studentRoutes';
import adminRoutes from './routes/adminRoutes';
import reviewRoutes from './routes/reviewRoutes';
import contactRoutes from './routes/contactRoutes';

// Import Middleware
import errorHandler from './middleware/errorHandler';

// Load env vars
dotenv.config();

// Initialize App
const app = express();

// Trust Proxy (Required for Render/Heroku & Rate Limiting)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
if (process.env.NODE_ENV !== 'test') {
    app.use(mongoSanitize());
}
// xss-clean types are missing, skipping for now until fixed properly or replaced with sanitization middleware
// app.use(xss()); 
app.use(hpp());
import { RedisStore } from 'rate-limit-redis';
import redisService from './services/RedisService';


// Rate Limiting with Redis
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        // @ts-ignore
        sendCommand: (...args: string[]) => redisService.getClient().call(...args),
    }),
});
app.use('/api', limiter);


// CORS
// CORS-
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5177',
    'https://stringz-lijo.vercel.app',
    process.env.CLIENT_URL || '',
    process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            Logger.warn(`Blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body Parser
app.use(express.json());
app.use(cookieParser());
app.use(compression());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Swagger Docs
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

export default app;
