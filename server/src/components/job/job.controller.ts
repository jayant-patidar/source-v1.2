import { Request, Response, NextFunction } from 'express';
import JobService from './job.service';

class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  async createJob(req: any, res: Response, next: NextFunction) {
    try {
      const jobData = {
        ...req.body,
        seekerId: req.user._id, // Authenticated user is the seeker (poster)
        originalPay: req.body.pay, // Mapping simple pay to originalPay
        currentPay: req.body.pay, // Initialize currentPay
        location: {
            general: req.body.generalLocation || req.body.location?.general,
            exact: req.body.exactLocation || req.body.location?.exact
        },
        updatedPay: [], // Initialize empty array
        // Ensure tags is an array if it comes as string
        tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : []),
        requirements: Array.isArray(req.body.requirements) ? req.body.requirements : (req.body.requirements ? req.body.requirements.split(',').map((r: string) => r.trim()) : [])
      };
      console.log('Received Job Body:', req.body);
      console.log('Constructed Job Data:', jobData);
      const newJob = await this.jobService.createJob(jobData);
      res.status(201).json(newJob);
    } catch (error) {
      console.error('Error creating job:', error);
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getAllJobs(req.query);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobsByPoster(req: any, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getJobsByPoster(req.user._id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobsByProvider(req: any, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getJobsByProvider(req.user._id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (job) {
        console.log('getJobById returning:', JSON.stringify(job));
        res.status(200).json(job);
      } else {
        res.status(404).json({ error: 'Job not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req: Request, res: Response, next: NextFunction) {
      try {
          const jobId = req.params.id;
          const updateData = { ...req.body };

          if (updateData.requirements && typeof updateData.requirements === 'string') {
              updateData.requirements = updateData.requirements.split(',').map((r: string) => r.trim());
          }

          // Handle Pay Update Logic
          if (updateData.pay) {
              const existingJob = await this.jobService.getJobById(jobId);
              if (existingJob) {
                  const newPay = Number(updateData.pay);
                  // Only update if pay is different
                  if (newPay !== existingJob.currentPay && newPay !== existingJob.originalPay) {
                      // Add old pay to history
                      const oldPay = existingJob.currentPay || existingJob.originalPay;
                      updateData.updatedPay = [
                          ...(existingJob.updatedPay || []),
                          { pay: oldPay, updatedAt: new Date() }
                      ];
                      updateData.currentPay = newPay;
                  }
                  delete updateData.pay; // Remove 'pay' to avoid confusion/overwriting
              }
          }

          const updatedJob = await this.jobService.updateJob(jobId, updateData);
          if (updatedJob) {
              res.status(200).json(updatedJob);
          } else {
              res.status(404).json({ error: 'Job not found' });
          }
      } catch (error) {
          next(error);
      }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
      try {
          const deletedJob = await this.jobService.deleteJob(req.params.id);
          if (deletedJob) {
              res.status(200).json({ message: 'Job removed' });
          } else {
              res.status(404).json({ error: 'Job not found' });
          }
      } catch (error) {
          next(error);
      }
  }
  async startJob(req: any, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if user is seeker or provider
      const isSeeker = job.seekerId.toString() === req.user._id.toString() || (job.seekerId as any)._id?.toString() === req.user._id.toString();
      const isProvider = job.providerId?.toString() === req.user._id.toString() || (job.providerId as any)?._id?.toString() === req.user._id.toString();

      if (!isSeeker && !isProvider) {
        return res.status(403).json({ error: 'Not authorized to start this job' });
      }

      if (job.status !== 'accepted') {
        return res.status(400).json({ error: 'Job must be accepted to start' });
      }

      // Update status and startTime
      const updatedJob = await this.jobService.updateJob(jobId, {
        status: 'in_progress',
        startTime: new Date()
      });

      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
