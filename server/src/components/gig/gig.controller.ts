import { Request, Response, NextFunction } from 'express';
import GigService from './gig.service';

class GigController {
  private gigService: GigService;

  constructor() {
    this.gigService = new GigService();
  }

  async createGig(req: any, res: Response, next: NextFunction) {
    try {
      const gigData = { ...req.body, providerId: req.user._id };
      const newGig = await this.gigService.createGig(gigData);
      res.status(201).json(newGig);
    } catch (error) {
      next(error);
    }
  }

  async getGigs(req: Request, res: Response, next: NextFunction) {
    try {
      const gigs = await this.gigService.getGigs(req.query);
      res.status(200).json(gigs);
    } catch (error) {
      next(error);
    }
  }

  async getGigById(req: Request, res: Response, next: NextFunction) {
    try {
      const gig = await this.gigService.getGigById(req.params.id);
      if (gig) {
        res.status(200).json(gig);
      } else {
        res.status(404).json({ error: 'Gig not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getMyGigs(req: any, res: Response, next: NextFunction) {
    try {
      const gigs = await this.gigService.getGigsByProvider(req.user._id);
      res.status(200).json(gigs);
    } catch (error) {
      next(error);
    }
  }

  async updateGig(req: any, res: Response, next: NextFunction) {
    try {
      const updatedGig = await this.gigService.updateGig(req.params.id, req.body, req.user._id);
      res.status(200).json(updatedGig);
    } catch (error) {
      next(error);
    }
  }

  async deleteGig(req: any, res: Response, next: NextFunction) {
    try {
      await this.gigService.deleteGig(req.params.id, req.user._id);
      res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async bookGig(req: any, res: Response, next: NextFunction) {
    try {
      const newJob = await this.gigService.bookGig(req.params.id, req.user._id, req.body);
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  }
}

export default new GigController();
