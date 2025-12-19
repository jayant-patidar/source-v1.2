import express from 'express';
import reviewController from './review.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, reviewController.createReview.bind(reviewController));
router.post('/:reviewId/reply', protect, reviewController.replyToReview.bind(reviewController));
router.get('/job/:jobId', protect, reviewController.getReviewsByJob.bind(reviewController));
router.get('/:userId', reviewController.getUserReviews.bind(reviewController));

export default router;
