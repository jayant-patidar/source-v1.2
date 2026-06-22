import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import logger from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './components/user/user.routes';
import jobRoutes from './components/job/job.routes';
import transactionRoutes from './components/transaction/transaction.routes';
import negotiationRoutes from './components/negotiation/negotiation.routes';
import reviewRoutes from './components/review/review.routes';
import notificationRoutes from './components/notification/notification.routes';

dotenv.config();

const app = express();

// Trust the first proxy (Render's reverse proxy) so secure cookies work properly
app.set('trust proxy', 1);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'development'
      ? ['http://localhost:5173', 'http://localhost:3000']
      : [process.env.CLIENT_URL || 'https://your-production-domain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use new component routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many attempts, try again later' }
});

app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
