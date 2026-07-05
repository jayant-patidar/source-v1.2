import GigDAL from './gig.dal';
import { IGig } from './gig.model';
import JobDAL from '../job/job.dal';
import mongoose from 'mongoose';

class GigService {
  private gigDAL: GigDAL;
  private jobDAL: JobDAL;

  constructor() {
    this.gigDAL = new GigDAL();
    this.jobDAL = new JobDAL();
  }

  async createGig(gigData: Partial<IGig>): Promise<IGig> {
    if (!gigData.title || !gigData.description || !gigData.price || !gigData.category) {
      throw new Error('Please provide all required fields (title, description, price, category)');
    }
    return await this.gigDAL.createGig(gigData);
  }

  async getGigs(filters: any): Promise<IGig[]> {
    const query: any = { isActive: true };
    if (filters.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    if (filters.keyword) {
      query.$or = [
        { title: { $regex: filters.keyword, $options: 'i' } },
        { description: { $regex: filters.keyword, $options: 'i' } }
      ];
    }
    return await this.gigDAL.getGigs(query);
  }

  async getGigById(gigId: string): Promise<IGig | null> {
    return await this.gigDAL.getGigById(gigId);
  }

  async getGigsByProvider(providerId: string): Promise<IGig[]> {
    return await this.gigDAL.getGigsByProvider(providerId);
  }

  async updateGig(gigId: string, updateData: Partial<IGig>, userId: string): Promise<IGig | null> {
    const gig = await this.gigDAL.getGigById(gigId);
    if (!gig) {
      throw new Error('Gig not found');
    }
    if (gig.providerId._id.toString() !== userId) {
      throw new Error('Not authorized to update this Gig');
    }
    return await this.gigDAL.updateGig(gigId, updateData);
  }

  async deleteGig(gigId: string, userId: string): Promise<IGig | null> {
    const gig = await this.gigDAL.getGigById(gigId);
    if (!gig) {
      throw new Error('Gig not found');
    }
    if (gig.providerId._id.toString() !== userId) {
      throw new Error('Not authorized to delete this Gig');
    }
    return await this.gigDAL.deleteGig(gigId);
  }

  async bookGig(gigId: string, seekerId: string, bookingDetails: any): Promise<any> {
    const gig = await this.gigDAL.getGigById(gigId);
    if (!gig) {
      throw new Error('Gig not found');
    }
    if (!gig.isActive) {
      throw new Error('This Gig is currently not active');
    }
    if (gig.providerId._id.toString() === seekerId) {
      throw new Error('You cannot book your own Gig');
    }

    if (!bookingDetails.jobDate || !bookingDetails.jobTime || !bookingDetails.exactLocation || !bookingDetails.generalLocation) {
      throw new Error('Please provide job date, time, and locations for the booking');
    }

    // Spawn an accepted Job based on the Gig
    const jobData: any = {
      title: `[Gig Booking] ${gig.title}`,
      description: gig.description,
      seekerId: new mongoose.Types.ObjectId(seekerId),
      providerId: gig.providerId._id,
      category: gig.category,
      jobDate: bookingDetails.jobDate,
      jobTime: bookingDetails.jobTime,
      expirationDate: bookingDetails.jobDate, // Required by Job schema, even though this job is already accepted
      originalPay: gig.price,
      location: {
        general: bookingDetails.generalLocation,
        exact: bookingDetails.exactLocation,
      },
      visibility: false,
      isNegotiable: false,
      status: 'accepted',
      paymentMethod: bookingDetails.paymentMethod || 'cash',
      tags: gig.tags || [],
    };

    const newJob = await this.jobDAL.createJob(jobData);
    return newJob;
  }
}

export default GigService;
