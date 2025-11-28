import ReviewDAL from './review.dal';
import { IReview } from './review.model';
import UserDAL from '../user/user.dal';
import JobDAL from '../job/job.dal';

class ReviewService {
  private reviewDAL: ReviewDAL;
  private userDAL: UserDAL;
  private jobDAL: JobDAL;

  constructor() {
    this.reviewDAL = new ReviewDAL();
    this.userDAL = new UserDAL();
    this.jobDAL = new JobDAL();
  }

  async createReview(data: any, reviewerId: string): Promise<IReview> {
    const { jobId, revieweeId, rating, comment } = data;

    // Check if review already exists
    const existingReview = await this.reviewDAL.checkReviewExists(jobId, reviewerId, revieweeId);
    if (existingReview) {
      throw new Error('You have already reviewed this user for this job');
    }

    const review = await this.reviewDAL.createReview({
      job: jobId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    } as any);

    // Update user rating
    // We need to know if reviewee was seeker or provider
    const job = await this.jobDAL.getJobById(jobId);
    if (job) {
        const reviews = await this.reviewDAL.getReviewsByRevieweeId(revieweeId);
        const numReviews = reviews.length;
        const ratingSum = reviews.reduce((acc, item) => item.rating + acc, 0);
        const avgRating = ratingSum / numReviews;

        // Determine role
        // If reviewee is job.seekerId -> They are the Seeker (Poster) -> Update seekerRating
        // If reviewee is job.providerId -> They are the Provider (Worker) -> Update providerRating
        
        // Note: job.seekerId is an ObjectId, need to convert to string for comparison
        if (job.seekerId.toString() === revieweeId) {
             // Update seekerRating
             // UserDAL doesn't have generic update method exposed in my previous step, let's use direct model or add method.
             // I'll assume I can add a method to UserDAL or just use the model in Service if needed, but better to keep it in DAL.
             // For now, I'll instantiate User model directly here or add update to UserDAL?
             // I'll add `updateUser` to UserDAL in a separate step or just use `User.findByIdAndUpdate` if I import the model.
             // But I should stick to DAL pattern.
             // Let's import User model here for now to avoid circular dependency hell or just add update to UserDAL.
             // I will import User model from component.
             const User = require('../user/user.model').default;
             await User.findByIdAndUpdate(revieweeId, { seekerRating: avgRating });
        } else if (job.providerId && job.providerId.toString() === revieweeId) {
             const User = require('../user/user.model').default;
             await User.findByIdAndUpdate(revieweeId, { providerRating: avgRating });
        }
    }

    return review;
  }

  async getUserReviews(userId: string): Promise<IReview[]> {
    return await this.reviewDAL.getReviewsByRevieweeId(userId);
  }
}

export default ReviewService;
