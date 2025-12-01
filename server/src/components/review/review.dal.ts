import Review, { IReview } from './review.model';

class ReviewDAL {
  async createReview(data: Partial<IReview>): Promise<IReview> {
    const review = new Review(data);
    return await review.save();
  }

  async getReviewsByRevieweeId(revieweeId: string): Promise<IReview[]> {
    return await Review.find({ reviewee: revieweeId })
      .populate('reviewer', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
  }

  async checkReviewExists(jobId: string, reviewerId: string, revieweeId: string): Promise<IReview | null> {
    return await Review.findOne({
      job: jobId,
      reviewer: reviewerId,
      reviewee: revieweeId,
    });
  }
}

export default ReviewDAL;
