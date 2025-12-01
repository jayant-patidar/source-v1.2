import User, { IUser } from './user.model';

class UserDAL {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser = new User(userData);
    return await newUser.save();
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find({});
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  async getUserByIdWithoutPassword(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select('-password');
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
  }

  async getPublicUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select('name avatar seekerRating providerRating about skills preferences portfolio socialLinks createdAt');
  }

  async toggleSavedJob(userId: string, jobId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;

    const isSaved = user.savedJobs?.includes(jobId as any);
    if (isSaved) {
      user.savedJobs = user.savedJobs?.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs?.push(jobId as any);
    }
    return await user.save();
  }

  async getSavedJobs(userId: string): Promise<any> {
    const user = await User.findById(userId).populate({
      path: 'savedJobs',
      populate: {
        path: 'seekerId',
        select: 'name avatar seekerRating'
      }
    });
    return user?.savedJobs || [];
  }
}

export default UserDAL;
