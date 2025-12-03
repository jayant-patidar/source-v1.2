import express from 'express';
import { protect } from '../../middleware/auth.middleware';
import { getNotifications, markAsRead, markAllAsRead } from './notification.controller';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);

export default router;
