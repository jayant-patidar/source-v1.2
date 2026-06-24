import Gig, { IGig } from './gig.model';

class GigDAL {
  async createGig(gigData: Partial<IGig>): Promise<IGig> {
    const newGig = new Gig(gigData);
    return await newGig.save();
  }

  async getGigs(filter: any = {}): Promise<IGig[]> {
    return await Gig.find(filter)
      .populate('providerId', 'name email avatar providerRating')
      .sort({ createdAt: -1 });
  }

  async getGigById(gigId: string): Promise<IGig | null> {
    return await Gig.findById(gigId)
      .populate('providerId', 'name email avatar providerRating');
  }

  async getGigsByProvider(providerId: string): Promise<IGig[]> {
    return await Gig.find({ providerId })
      .sort({ createdAt: -1 });
  }

  async updateGig(gigId: string, updateData: Partial<IGig>): Promise<IGig | null> {
    return await Gig.findByIdAndUpdate(gigId, updateData, { new: true });
  }

  async deleteGig(gigId: string): Promise<IGig | null> {
    return await Gig.findByIdAndDelete(gigId);
  }
}

export default GigDAL;
