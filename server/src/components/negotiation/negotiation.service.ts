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
      message: data.message
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

  async updateNegotiationStatus(id: string, status: 'accepted' | 'rejected', userId: string): Promise<INegotiation | null> {
    const negotiation = await this.negotiationDAL.getNegotiationById(id);
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }

    // Only the Seeker (Job Poster) can accept/reject
    if (negotiation.seeker.toString() !== userId) {
      throw new Error('Not authorized');
    }

    const updatedNegotiation = await this.negotiationDAL.updateNegotiation(id, { status });

    if (status === 'accepted') {
        // Update Job status
        await this.jobDAL.updateJob((negotiation.job as any).toString(), { 
            status: 'accepted',
            providerId: negotiation.provider // Assign the applicant (Provider)
        } as any);
    }

    return updatedNegotiation;
  }
}

export default NegotiationService;
