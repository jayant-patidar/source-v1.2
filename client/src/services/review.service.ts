import api from './api';

export const reviewService = {
  async getReviewsByJob(jobId: string) {
    const { data } = await api.get(`/reviews/job/${jobId}`);
    return data;
  },

  async createReview(reviewData: { job: string; rating: number; comment: string }) {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  },

  async getUserReviews(userId: string) {
    const { data } = await api.get(`/reviews/${userId}`);
    return data;
  }
};
