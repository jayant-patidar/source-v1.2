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
}

export default UserDAL;
