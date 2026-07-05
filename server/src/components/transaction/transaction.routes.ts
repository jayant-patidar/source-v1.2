import { Router } from 'express';
import TransactionController from './transaction.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.get('/test', (req, res) => res.json({ message: 'Transaction route works' }));

router.post('/purchase', protect, TransactionController.purchaseCoins);
router.post('/transfer', protect, TransactionController.transferCoins);
router.get('/history', protect, TransactionController.getUserTransactions);
router.get('/balance', protect, TransactionController.getWalletBalance);
router.get('/job/:jobId', protect, TransactionController.getTransactionsByJob);

export default router;
