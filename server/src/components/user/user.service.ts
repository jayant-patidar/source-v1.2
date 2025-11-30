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
}

export default UserService;
