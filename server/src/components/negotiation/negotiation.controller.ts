import { Request, Response, NextFunction } from 'express';
import NegotiationService from './negotiation.service';

class NegotiationController {
  private negotiationService: NegotiationService;

  constructor() {
    this.negotiationService = new NegotiationService();
  }

  async createNegotiation(req: any, res: Response, next: NextFunction) {
    try {
      const negotiation = await this.negotiationService.createNegotiation(req.body, req.user._id);
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

  async updateNegotiationStatus(req: any, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const negotiation = await this.negotiationService.updateNegotiationStatus(req.params.id, status, req.user._id);
      res.json(negotiation);
    } catch (error) {
      next(error);
    }
  }
}

export default new NegotiationController();
