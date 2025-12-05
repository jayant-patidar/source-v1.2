import Negotiation, { INegotiation } from './negotiation.model';

class NegotiationDAL {
  async createNegotiation(data: Partial<INegotiation>): Promise<INegotiation> {
    const negotiation = new Negotiation(data);
    return await negotiation.save();
  }

  async getNegotiationsByJobId(jobId: string): Promise<INegotiation[]> {
    return await Negotiation.find({ job: jobId })
      .populate('seeker', 'name rating')
      .populate('provider', 'name avatar providerRating')
      .sort({ createdAt: -1 });
  }

  async getNegotiationsByProvider(providerId: string): Promise<INegotiation[]> {
    return await Negotiation.find({ provider: providerId })
      .populate('job', 'title status originalPay')
      .populate('seeker', 'name avatar')
      .sort({ createdAt: -1 });
  }

  async getNegotiationsBySeeker(seekerId: string): Promise<INegotiation[]> {
    return await Negotiation.find({ seeker: seekerId })
      .populate('job', 'title status originalPay')
      .populate('provider', 'name avatar providerRating')
      .sort({ createdAt: -1 });
  }

  async getNegotiationById(id: string): Promise<INegotiation | null> {
    return await Negotiation.findById(id);
  }

  async updateNegotiation(id: string, update: Partial<INegotiation>): Promise<INegotiation | null> {
    return await Negotiation.findByIdAndUpdate(id, update, { new: true });
  }
}

export default NegotiationDAL;
