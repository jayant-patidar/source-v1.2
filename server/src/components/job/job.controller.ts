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
        requirements: Array.isArray(req.body.requirements) ? req.body.requirements : (req.body.requirements ? req.body.requirements.split(',').map((r: string) => r.trim()) : []),
        timeline: [{ status: 'created', timestamp: new Date(), actorId: req.user._id }]
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

          const existingJob = await this.jobService.getJobById(jobId);
          const actorId = (req as any).user?._id;
          const timelineEvents: any[] = [];
          
          // Handle Pay Update Logic
          if (updateData.pay) {
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
                      
                      timelineEvents.push({ 
                          status: 'pay_updated', 
                          timestamp: new Date(), 
                          actorId,
                          details: `Pay updated to $${newPay}` 
                      });
                  }
                  delete updateData.pay; // Remove 'pay' to avoid confusion/overwriting
              }
          }

          // Detect Status Change and Update Timeline
          if (updateData.status && updateData.status !== existingJob?.status) {
               timelineEvents.push({ 
                   status: updateData.status, 
                   timestamp: new Date(), 
                   actorId 
               });
          }

          // If there are timeline events, add them to the update
          if (timelineEvents.length > 0) {
              (updateData as any).$push = { timeline: { $each: timelineEvents } };
              delete updateData.timeline; // Ensure we don't overwrite if passed in body
          }

          const updatedJob = await this.jobService.updateJob(jobId, updateData as any);
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

      if (job.status !== 'accepted' && job.status !== 'pending_start_approval') {
        return res.status(400).json({ error: 'Job must be accepted to start' });
      }

      // Check for early start
      const now = new Date();
      const jobDate = new Date(job.jobDate);
      
      // Parse jobTime (HH:mm)
      const [hours, minutes] = job.jobTime.split(':').map(Number);
      const scheduledTime = new Date(jobDate);
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If actor is provider and it's early
      if (isProvider && now < scheduledTime && !isSeeker) {
          if (job.status === 'pending_start_approval') {
              return res.status(400).json({ error: 'Start request already pending approval' });
          }
          
          const updatedJob = await this.jobService.updateJob(jobId, {
            status: 'pending_start_approval',
            $push: { timeline: { status: 'start_requested_early', timestamp: new Date(), actorId: (req as any).user._id, details: 'Provider requested to start before scheduled time' } }
          } as any);
          return res.status(200).json({ message: 'Early start requested. Waiting for seeker approval.', job: updatedJob });
      }

      // Update status and startTime (normal start or seeker start)
      const updatedJob = await this.jobService.updateJob(jobId, {
        status: 'in_progress',
        startTime: new Date(),
        $push: { timeline: { status: 'started', timestamp: new Date(), actorId: (req as any).user._id } }
      } as any);

      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async approveStart(req: any, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Only Seeker can approve
      const isSeeker = job.seekerId.toString() === req.user._id.toString() || (job.seekerId as any)._id?.toString() === req.user._id.toString();
      
      if (!isSeeker) {
        return res.status(403).json({ error: 'Only seeker can approve early start' });
      }

      if (job.status !== 'pending_start_approval') {
        return res.status(400).json({ error: 'Job is not pending start approval' });
      }

      const updatedJob = await this.jobService.updateJob(jobId, {
        status: 'in_progress',
        startTime: new Date(),
        $push: { timeline: { status: 'started_early_approved', timestamp: new Date(), actorId: req.user._id } }
      } as any);

      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async archiveJob(req: any, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      const isOwner = job.seekerId.toString() === req.user._id.toString() || (job.seekerId as any)._id?.toString() === req.user._id.toString();
      if (!isOwner) return res.status(403).json({ error: 'Only the job poster can archive this job' });

      const updatedJob = await this.jobService.updateJob(req.params.id, {
        isArchived: true,
        $push: { timeline: { status: 'archived', timestamp: new Date(), actorId: req.user._id } }
      } as any);
      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async unarchiveJob(req: any, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      const isOwner = job.seekerId.toString() === req.user._id.toString() || (job.seekerId as any)._id?.toString() === req.user._id.toString();
      if (!isOwner) return res.status(403).json({ error: 'Only the job poster can unarchive this job' });

      const updatedJob = await this.jobService.updateJob(req.params.id, {
        isArchived: false,
        $push: { timeline: { status: 'unarchived', timestamp: new Date(), actorId: req.user._id } }
      } as any);
      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async repostJob(req: any, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      const isOwner = job.seekerId.toString() === req.user._id.toString() || (job.seekerId as any)._id?.toString() === req.user._id.toString();
      if (!isOwner) return res.status(403).json({ error: 'Only the job poster can repost this job' });

      const { expirationDate } = req.body;
      if (!expirationDate || new Date(expirationDate) <= new Date()) {
        return res.status(400).json({ error: 'Expiration date must be in the future' });
      }

      const updatedJob = await this.jobService.updateJob(req.params.id, {
        status: 'open',
        expirationDate: new Date(expirationDate),
        isArchived: false,
        $push: { timeline: { status: 'reposted', timestamp: new Date(), actorId: req.user._id, details: 'Reposted with new expiration date' } }
      } as any);
      res.status(200).json(updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async getArchivedJobs(req: any, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getArchivedJobsByPoster(req.user._id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getCancelledJobs(req: any, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getCancelledJobsByPoster(req.user._id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getExpiredJobs(req: any, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getExpiredJobsByPoster(req.user._id);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
