import { Router } from 'express';
import { createTransaction, getTransactionsByJob } from './transaction.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createTransaction);
router.get('/job/:jobId', protect, getTransactionsByJob);

export default router;
