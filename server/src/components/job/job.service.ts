import JobDAL from './job.dal';
import { IJob } from './job.model';

class JobService {
  private jobDAL: JobDAL;

  constructor() {
    this.jobDAL = new JobDAL();
  }

  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    // Add any specific validation or logic here
    return await this.jobDAL.createJob(jobData);
  }

  async getAllJobs(query: any): Promise<IJob[]> {
    const filter: any = {
      visibility: true,
      status: 'open', // Also ensuring only open jobs are shown in the feed
      expirationDate: { $gte: new Date() }, // Don't show expired jobs
      isArchived: false, // Don't show archived jobs
      title: { $not: /\[Gig Booking\]/i } // Exclude gig bookings from public feed
    };

    // Keyword Search (Title or Description)
    if (query.keyword) {
      filter.$or = [
        { title: { $regex: query.keyword, $options: 'i' } },
        { description: { $regex: query.keyword, $options: 'i' } }
      ];
    }

    // Category Filter
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    // Pay Range Filter
    if (query.minPay || query.maxPay) {
      filter.originalPay = {};
      if (query.minPay) filter.originalPay.$gte = Number(query.minPay);
      if (query.maxPay) filter.originalPay.$lte = Number(query.maxPay);
    }

    // Job Type Filter
    if (query.type && query.type !== 'all') {
      filter.type = query.type; // 'hourly' or 'fixed-price' (mapped from frontend)
    }

    // Location Filter
    if (query.location) {
      filter['location.general'] = { $regex: query.location, $options: 'i' };
    }

    // Date Posted Filter
    if (query.datePosted) {
      const now = new Date();
      let pastDate = new Date();
      
      switch (query.datePosted) {
        case '24h':
          pastDate.setDate(now.getDate() - 1);
          break;
        case '7d':
          pastDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          pastDate.setDate(now.getDate() - 30);
          break;
        default:
          pastDate = new Date(0); // All time
      }
      
      if (query.datePosted !== 'all') {
        filter.createdAt = { $gte: pastDate };
      }
    }

    return await this.jobDAL.getAllJobs(filter, query.sortBy, query.limit ? Number(query.limit) : undefined);
  }

  async getJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await this.jobDAL.getJobsByPoster(seekerId);
  }

  async getJobsByProvider(providerId: string): Promise<IJob[]> {
    return await this.jobDAL.getJobsByProvider(providerId);
  }

  async getJobById(jobId: string): Promise<IJob | null> {
    return await this.jobDAL.getJobById(jobId);
  }

  async updateJob(jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
    return await this.jobDAL.updateJob(jobId, updateData);
  }

  async deleteJob(jobId: string): Promise<IJob | null> {
    return await this.jobDAL.deleteJob(jobId);
  }

  async getArchivedJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await this.jobDAL.getArchivedJobsByPoster(seekerId);
  }

  async getCancelledJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await this.jobDAL.getCancelledJobsByPoster(seekerId);
  }

  async getExpiredJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await this.jobDAL.getExpiredJobsByPoster(seekerId);
  }
}

export default JobService;
