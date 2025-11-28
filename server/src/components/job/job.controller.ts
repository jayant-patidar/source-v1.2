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
        location: {
            general: req.body.generalLocation || req.body.location?.general,
            exact: req.body.exactLocation || req.body.location?.exact
        },
        updatedPay: [], // Initialize empty array
        // Ensure tags is an array if it comes as string
        tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map((t: string) => t.trim()) : [])
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

  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (job) {
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
          const updatedJob = await this.jobService.updateJob(req.params.id, req.body);
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
}

export default new JobController();
