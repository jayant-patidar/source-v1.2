import { Request, Response, NextFunction } from 'express';
import NegotiationService from './negotiation.service';
import Notification from '../notification/notification.model';
import Job from '../job/job.model';
import User from '../user/user.model';

class NegotiationController {
  private negotiationService: NegotiationService;

  constructor() {
    this.negotiationService = new NegotiationService();
  }

  async createNegotiation(req: any, res: Response, next: NextFunction) {
    try {
      const negotiation = await this.negotiationService.createNegotiation(req.body, req.user._id.toString());
      
      // Create notification for seeker
      const job = await Job.findById(negotiation.job);
      if (job) {
          await Notification.create({
              recipient: job.seekerId,
              sender: req.user._id,
              type: 'offer_received',
              job: job._id,
              negotiation: negotiation._id,
              message: `New offer of $${negotiation.amount} received for ${job.title}`
          });
      }

      res.status(201).json(negotiation);
    } catch (error) {
      next(error);
    }
  }

  async getNegotiations(req: Request, res: Response, next: NextFunction) {
    try {
      const negotiations = await this.negotiationService.getNegotiationsByJobId(req.params.jobId);
      res.json(negotiations);
    } catch (error) {
      next(error);
    }
  }

  async getNegotiationsByUser(req: any, res: Response, next: NextFunction) {
    try {
      const negotiations = await this.negotiationService.getNegotiationsByProvider(req.user._id.toString());
      res.json(negotiations);
    } catch (error) {
      next(error);
    }
  }

  async getNegotiationsReceived(req: any, res: Response, next: NextFunction) {
    try {
      const negotiations = await this.negotiationService.getNegotiationsBySeeker(req.user._id.toString());
      res.json(negotiations);
    } catch (error) {
      next(error);
    }
  }

  async updateNegotiationStatus(req: any, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const negotiation = await this.negotiationService.updateNegotiationStatus(req.params.id, status, req.user._id.toString());
      
      if (negotiation) {
          const job = await Job.findById(negotiation.job);
          
          if (status === 'accepted' && job) {
              // Job is already updated in service
              // Just create notification


              // Notify Provider
              await Notification.create({
                  recipient: negotiation.provider,
                  sender: req.user._id,
                  type: 'offer_accepted',
                  job: job._id,
                  negotiation: negotiation._id,
                  message: `Your offer for ${job.title} has been ACCEPTED!`
              });
          } else if (status === 'rejected' && job) {
              // Notify Provider
              await Notification.create({
                  recipient: negotiation.provider,
                  sender: req.user._id,
                  type: 'offer_rejected',
                  job: job._id,
                  negotiation: negotiation._id,
                  message: `Your offer for ${job.title} was declined.`
              });
          }
      }

      res.json(negotiation);
    } catch (error) {
      next(error);
    }
  }
}

export default new NegotiationController();
