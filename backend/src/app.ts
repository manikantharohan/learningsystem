import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow multiple origins for development
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting - DISABLED for development to prevent 429 errors
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Very high limit for development
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip OPTIONS requests and local development
        if (req.method === 'OPTIONS') return true;
        // Skip rate limiting in development
        return process.env.NODE_ENV === 'development';
    },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Increased from 5 to 10
    message: { error: 'Too many authentication attempts, please try again later' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
