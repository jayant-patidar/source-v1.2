import Gig, { IGig } from './gig.model';

class GigDAL {
  async createGig(gigData: Partial<IGig>): Promise<IGig> {
    const newGig = new Gig(gigData);
    return await newGig.save();
  }

  async getGigs(filter: any = {}, sortBy: string = 'newest', limit?: number): Promise<IGig[]> {
    let sortOptions: any = { createdAt: -1 }; // Default: Newest

    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'priceHigh') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'priceLow') {
      sortOptions = { price: 1 };
    }

    let query = Gig.find(filter)
      .populate('providerId', 'name email avatar providerRating')
      .sort(sortOptions);

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
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
