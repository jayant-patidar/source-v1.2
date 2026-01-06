import mongoose from 'mongoose';
import NegotiationDAL from './negotiation.dal';
import { INegotiation } from './negotiation.model';
import JobDAL from '../job/job.dal';

class NegotiationService {
  private negotiationDAL: NegotiationDAL;
  private jobDAL: JobDAL;

  constructor() {
    this.negotiationDAL = new NegotiationDAL();
    this.jobDAL = new JobDAL();
  }

  async createNegotiation(data: any, userId: string): Promise<INegotiation> {
    const job = await this.jobDAL.getJobById(data.jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Check if user is the job poster (provider)
    // In the original controller: if (job.poster.toString() === req.user._id.toString())
    // But wait, the job model has `seekerId` (poster) and `providerId` (worker/applicant)?
    // Let's check Job Model.
    // Job Model: seekerId (required, ref User), providerId (optional, ref User).
    // Usually 'seeker' posts the job looking for a 'provider'.
    // So seekerId is the poster.
    
    if (job.seekerId.toString() === userId) {
        throw new Error('Cannot negotiate on your own job');
    }

    // Negotiation model mapping:
    // - seeker: The job poster (Service Seeker)
    // - provider: The applicant/worker (Service Provider)
    return await this.negotiationDAL.createNegotiation({
      job: data.jobId,
      seeker: job.seekerId, // Poster
      provider: userId,     // Applicant
      amount: data.amount,
      message: data.message,
      lastActor: 'provider', // The one who created the offer
      offerHistory: [{
          amount: data.amount,
          message: data.message,
          actor: 'provider',
          timestamp: new Date()
      }]
    } as any);
  }

  async getNegotiationsByJobId(jobId: string): Promise<INegotiation[]> {
    return await this.negotiationDAL.getNegotiationsByJobId(jobId);
  }

  async getNegotiationsByProvider(providerId: string): Promise<INegotiation[]> {
    return await this.negotiationDAL.getNegotiationsByProvider(providerId);
  }

  async getNegotiationsBySeeker(seekerId: string): Promise<INegotiation[]> {
    return await this.negotiationDAL.getNegotiationsBySeeker(seekerId);
  }

  async counterOffer(id: string, data: any, userId: string): Promise<INegotiation | null> {
      const negotiation = await this.negotiationDAL.getNegotiationById(id);
      if (!negotiation) {
          throw new Error('Negotiation not found');
      }

      if (negotiation.status === 'accepted' || negotiation.status === 'rejected') {
          throw new Error('Negotiation is already closed');
      }

      // Determine if actor is seeker or provider
      const isSeeker = negotiation.seeker.toString() === userId;
      const isProvider = negotiation.provider.toString() === userId;

      if (!isSeeker && !isProvider) {
          throw new Error('Not authorized to counter this offer');
      }

      const actorType = isSeeker ? 'seeker' : 'provider';

      // Check if it's their turn (optional but good for multi-round logic)
      // If we allow multiple counters without reply, we might skip this. 
      // User said "back and forth", so it should be the OTHER party's turn.
      if (negotiation.lastActor === actorType) {
          throw new Error('It is not your turn to counter');
      }

      // Check counter limits
      if (isSeeker && negotiation.seekerCounterCount >= 2) {
          throw new Error('Seeker counter offer limit reached (2/2)');
      }
      if (isProvider && negotiation.providerCounterCount >= 2) {
          throw new Error('Provider counter offer limit reached (2/2)');
      }

      const updateData: any = {
          amount: data.amount,
          message: data.message,
          lastActor: actorType,
          status: 'countered',
          $push: {
              offerHistory: {
                  amount: data.amount,
                  message: data.message,
                  actor: actorType,
                  timestamp: new Date()
              }
          },
          $inc: {
              [isSeeker ? 'seekerCounterCount' : 'providerCounterCount']: 1
          }
      };

      const updatedNegotiation = await this.negotiationDAL.updateNegotiation(id, updateData);

      // Log to Job Timeline
      await this.jobDAL.updateJob((negotiation.job as any).toString(), {
          $push: { timeline: { 
              status: 'counter_offer_received', 
              timestamp: new Date(), 
              actorId: userId, 
              details: `Counter offer of $${data.amount} by ${actorType}` 
          } }
      } as any);

      return updatedNegotiation;
  }

  async updateNegotiationStatus(id: string, status: 'accepted' | 'rejected', userId: string): Promise<INegotiation | null> {
    const negotiation = await this.negotiationDAL.getNegotiationById(id);
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }

    // Determine actor
    const isSeeker = negotiation.seeker.toString() === userId;
    const isProvider = negotiation.provider.toString() === userId;

    if (!isSeeker && !isProvider) {
        throw new Error('Not authorized');
    }

    // For acceptance, it should be the OTHER party who accepts (not the one who made the last offer)
    if (status === 'accepted' && negotiation.lastActor === (isSeeker ? 'seeker' : 'provider')) {
        throw new Error('Cannot accept your own offer');
    }

    const updatedNegotiation = await this.negotiationDAL.updateNegotiation(id, { status });

    if (status === 'accepted') {
        console.log('Negotiation accepted. Updating Job:', negotiation.job);
        console.log('Assigning Provider:', negotiation.provider);
        console.log('Setting Price:', negotiation.amount);
        
        // Update Job status and PRICE (currentPay)
        const updatedJob = await this.jobDAL.updateJob((negotiation.job as any).toString(), { 
            status: 'accepted',
            currentPay: negotiation.amount, // Set the negotiated price
            providerId: new mongoose.Types.ObjectId(negotiation.provider.toString()), // Assign the applicant (Provider)
            $push: { timeline: { status: 'accepted', timestamp: new Date(), actorId: userId, details: `Job accepted at Negotiated Price: $${negotiation.amount}` } }
        } as any);
        console.log('Job Updated Result:', updatedJob);
    }

    return updatedNegotiation;
  }
}

export default NegotiationService;
