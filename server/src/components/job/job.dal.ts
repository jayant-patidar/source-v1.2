import Job, { IJob } from './job.model';

class JobDAL {
  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const newJob = new Job(jobData);
    return await newJob.save();
  }

  async getAllJobs(filter: any = {}, sortBy: string = 'newest', limit?: number): Promise<IJob[]> {
    let sortOptions: any = { createdAt: -1 }; // Default: Newest

    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'payHigh') {
      sortOptions = { originalPay: -1 };
    } else if (sortBy === 'payLow') {
      sortOptions = { originalPay: 1 };
    }

    let query = Job.find(filter)
      .populate('seekerId', 'name email seekerRating providerRating avatar')
      .populate('providerId', 'name email seekerRating providerRating avatar')
      .sort(sortOptions);

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  async getJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await Job.find({ seekerId, isArchived: false }).sort({ createdAt: -1 }).populate('providerId', 'name');
  }

  async getArchivedJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await Job.find({ seekerId, isArchived: true }).sort({ updatedAt: -1 }).populate('providerId', 'name');
  }

  async getCancelledJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await Job.find({ seekerId, status: 'canceled', isArchived: false }).sort({ updatedAt: -1 }).populate('providerId', 'name');
  }

  async getExpiredJobsByPoster(seekerId: string): Promise<IJob[]> {
    return await Job.find({
      seekerId,
      expirationDate: { $lt: new Date() },
      status: { $nin: ['completed', 'canceled'] },
      isArchived: false
    }).sort({ expirationDate: -1 }).populate('providerId', 'name');
  }

  async getJobsByProvider(providerId: string): Promise<IJob[]> {
    return await Job.find({ providerId }).sort({ createdAt: -1 }).populate('seekerId', 'name');
  }

  async getJobById(jobId: string): Promise<IJob | null> {
    return await Job.findById(jobId).populate('seekerId', 'name email seekerRating providerRating avatar').populate('providerId', 'name email seekerRating providerRating avatar');
  }

  async updateJob(jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
    return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
  }

  async deleteJob(jobId: string): Promise<IJob | null> {
    return await Job.findByIdAndDelete(jobId);
  }
}

export default JobDAL;
