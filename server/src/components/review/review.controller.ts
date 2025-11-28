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
}

export default new ReviewController();
