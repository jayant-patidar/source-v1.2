import UserDAL from './user.dal';
import { IUser } from './user.model';
import bcrypt from 'bcryptjs';

class UserService {
  private userDAL: UserDAL;

  constructor() {
    this.userDAL = new UserDAL();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Check if user exists
    const userExists = await this.userDAL.getUserByEmail(userData.email!);
    if (userExists) {
      throw new Error('User already exists');
    }

    return await this.userDAL.createUser(userData);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userDAL.getAllUsers();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userDAL.getUserById(userId);
  }

  async getUserByIdWithoutPassword(userId: string): Promise<IUser | null> {
    return await this.userDAL.getUserByIdWithoutPassword(userId);
  }

  async loginUser(email: string): Promise<IUser | null> {
     return await this.userDAL.getUserByEmail(email);
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await this.userDAL.updateUser(userId, updateData);
  }

  async getPublicUserById(userId: string): Promise<IUser | null> {
    return await this.userDAL.getPublicUserById(userId);
  }

  async toggleSavedJob(userId: string, jobId: string): Promise<IUser | null> {
    return await this.userDAL.toggleSavedJob(userId, jobId);
  }

  async getSavedJobs(userId: string): Promise<any> {
    return await this.userDAL.getSavedJobs(userId);
  }

  async recalculateTrustScore(userId: string): Promise<IUser | null> {
    const user = await this.userDAL.getUserById(userId);
    if (!user) return null;

    let score = 100; // Base score

    // Profile Completeness
    if (user.avatar) score += 25;
    if (user.about) score += 25;
    if (user.phone) score += 25;
    if (user.socialLinks && (user.socialLinks.linkedin || user.socialLinks.github || user.socialLinks.website)) {
      score += 25;
    }

    // ID Verification
    if (user.isVerified) score += 200;

    // Review Score
    let avgRating = 0;
    if (user.seekerRating > 0 && user.providerRating > 0) {
      avgRating = (user.seekerRating + user.providerRating) / 2;
    } else if (user.seekerRating > 0) {
      avgRating = user.seekerRating;
    } else if (user.providerRating > 0) {
      avgRating = user.providerRating;
    }
    
    if (avgRating > 0) {
      score += (avgRating / 5) * 250;
    }

    // Experience (capped at 350)
    const experiencePoints = Math.min((user.completedJobsCount || 0) * 20, 350);
    score += experiencePoints;

    // Penalties
    score -= (user.canceledJobsCount || 0) * 50;

    // Cap boundaries
    if (score > 1000) score = 1000;
    if (score < 0) score = 0;

    return await this.userDAL.updateUser(userId, { trustScore: Math.round(score) });
  }
}

export default UserService;
