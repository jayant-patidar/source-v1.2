import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import logger from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './components/user/user.routes';
import jobRoutes from './components/job/job.routes';
import negotiationRoutes from './components/negotiation/negotiation.routes';
import reviewRoutes from './components/review/review.routes';

dotenv.config();

const app = express();

// Force restart 2


connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use new component routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/negotiations', negotiationRoutes);
app.use('/api/reviews', reviewRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
