import { Request, Response, NextFunction } from 'express';
import ReviewService from './review.service';

class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  async createReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await this.reviewService.createReview(req.body, req.user._id);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }

  async getUserReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await this.reviewService.getUserReviews(req.params.userId);
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async replyToReview(req: any, res: Response, next: NextFunction) {
      try {
          const { reviewId } = req.params;
          const { message } = req.body;
          console.log(`[DEBUG] replyToReview: reviewId=${reviewId}, userId=${req.user._id}, message=${message}`);
          
          const updatedReview = await this.reviewService.replyToReview(reviewId, req.user._id, message);
          console.log(`[DEBUG] replyToReview success:`, updatedReview);
          
          res.status(200).json(updatedReview);
      } catch (error) {
          console.error(`[DEBUG] replyToReview error:`, error);
          next(error);
      }
  }

  async getReviewsByJob(req: Request, res: Response, next: NextFunction) {
      try {
          const reviews = await this.reviewService.getReviewsByJob(req.params.jobId);
          res.json(reviews);
      } catch (error) {
          next(error);
      }
  }
}

export default new ReviewController();
