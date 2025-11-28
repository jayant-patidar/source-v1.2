import Job, { IJob } from './job.model';

class JobDAL {
  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const newJob = new Job(jobData);
    return await newJob.save();
  }

  async getAllJobs(filter: any = {}, sortBy: string = 'newest'): Promise<IJob[]> {
    let sortOptions: any = { createdAt: -1 }; // Default: Newest

    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'payHigh') {
      sortOptions = { originalPay: -1 };
    } else if (sortBy === 'payLow') {
      sortOptions = { originalPay: 1 };
    }

    return await Job.find(filter)
      .populate('seekerId', 'name email seekerRating providerRating avatar')
      .populate('providerId', 'name email seekerRating providerRating avatar')
      .sort(sortOptions);
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
