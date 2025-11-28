import express from 'express';
import reviewController from './review.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, reviewController.createReview.bind(reviewController));
router.get('/:userId', reviewController.getUserReviews.bind(reviewController));

export default router;
