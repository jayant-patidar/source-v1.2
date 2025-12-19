import Review, { IReview } from './review.model';
import User from '../user/user.model';
import Job from '../job/job.model'; // Assuming Job model is here
import mongoose from 'mongoose';

class ReviewService {
  async createReview(reviewData: Partial<IReview>, userId: string): Promise<IReview> {
    const { job, rating, comment } = reviewData;

    // Check if job exists and is completed/paid
    const existingJob = await Job.findById(job);
    if (!existingJob) {
      throw new Error('Job not found');
    }
    
    // Simplification based on current flow: reviews allowed if job is completed.
    // Ideally check payment status too.
    if (existingJob.status !== 'completed') {
        throw new Error('Job must be completed to leave a review');
    }

    // Determine roles
    const isSeeker = existingJob.seekerId.toString() === userId.toString();
    const isProvider = existingJob.providerId?.toString() === userId.toString();

    if (!isSeeker && !isProvider) {
      throw new Error('Not authorized to review this job');
    }

    const reviewer = userId;
    const reviewee = isSeeker ? existingJob.providerId : existingJob.seekerId;

    if (!reviewee) { // Should not happen for completed job
        throw new Error('Reviewee not found');
    }

    // Check for existing review
    const existingReview = await Review.findOne({ job, reviewer });
    if (existingReview) {
      throw new Error('You have already reviewed this job');
    }

    // Create Review
    const newReview = await Review.create({
      job,
      reviewer,
      reviewee,
      rating,
      comment
    });

    // Aggregation Logic: Update User Rating
    await this.updateUserRating(reviewee.toString(), isSeeker ? 'provider' : 'seeker'); 
    // If reviewer is Seeker, they are rating the Provider (so update providerRating).
    // If reviewer is Provider, they are rating the Seeker (so update seekerRating).

    return newReview;
  }

  async updateUserRating(userId: string, type: 'seeker' | 'provider') {
    const reviews = await Review.find({ reviewee: userId });
    // Filter reviews relevant to role? 
    // Currently our model captures all reviews for a user. 
    // We should distinguish? 
    // The requirement says "accumulate their final seeker and provider ratings".
    // We need to know which rating to update.
    // If I am a Provider, my "providerRating" should be average of reviews where I was reviewee AND reviewer was a Seeker.
    // Let's refine the query.
    
    // Find all reviews where 'reviewee' is userId.
    // We need to know context of each review to know if it counts towards seekerRating or providerRating.
    // We can infer context from the Job.
    
    let totalRating = 0;
    let count = 0;

    // This loop might be expensive if many reviews. Better to use aggregation pipeline.
    // But for now, let's use JS logic for simplicity and assumed scale.
    for (const review of reviews) {
        const job = await Job.findById(review.job);
        if (!job) continue;

        // processing logic:
        // if type is 'provider', we want reviews where this user acted as PROVIDER.
        // i.e., providerId === userId.
        if (type === 'provider' && job.providerId?.toString() === userId) {
             totalRating += review.rating;
             count++;
        } else if (type === 'seeker' && job.seekerId.toString() === userId) {
             totalRating += review.rating;
             count++;
        }
    }

    if (count > 0) {
        const average = parseFloat((totalRating / count).toFixed(1)); // 1 decimal place
        await User.findByIdAndUpdate(userId, { [type === 'seeker' ? 'seekerRating' : 'providerRating']: average });
    }
  }

  async getUserReviews(userId: string): Promise<IReview[]> {
    return await Review.find({ reviewee: userId })
      .populate('reviewer', 'name avatar')
      .populate('job', 'title seekerId providerId')
      .sort({ createdAt: -1 });
  }

  async replyToReview(reviewId: string, userId: string, message: string): Promise<IReview | null> {
      console.log(`[DEBUG] Service replyToReview: reviewId=${reviewId}, userId=${userId}`);
      
      const review = await Review.findById(reviewId);
      if (!review) {
          console.error(`[DEBUG] Service: Review not found: ${reviewId}`);
          throw new Error('Review not found');
      }

      // Only reviewee can reply
      if (review.reviewee.toString() !== userId.toString()) {
          console.error(`[DEBUG] Service: Unauthorized reply attempt. Reviewee=${review.reviewee}, User=${userId}`);
          throw new Error('Not authorized to reply to this review');
      }

      if (review.response && review.response.message) {
          console.error(`[DEBUG] Service: Already replied`);
          throw new Error('Already replied to this review');
      }

      // Use findByIdAndUpdate for atomic update
      const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          {
              $set: {
                  response: {
                      message,
                      createdAt: new Date()
                  }
              }
          },
          { new: true, runValidators: true }
      );
      
      console.log(`[DEBUG] Service: Reply saved successfully`);
      return updatedReview;
  }

  async getReviewsByJob(jobId: string): Promise<IReview[]> {
      return await Review.find({ job: jobId })
          .populate('reviewer', 'name avatar')
          .populate('reviewee', 'name avatar');
  }
}

export default ReviewService;
