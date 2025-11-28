import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import generateToken from '../../utils/generateToken';
import jwt from 'jsonwebtoken';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await this.userService.createUser(req.body);
      if (newUser) {
        generateToken(res, (newUser._id as any).toString());
        res.status(201).json({
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: 'user' // Default role
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.userService.loginUser(email);

      if (user && (await user.matchPassword(password))) {
        generateToken(res, (user._id as any).toString());
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          seekerRating: user.seekerRating,
          providerRating: user.providerRating,
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response) {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie('refresh_token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(401);
      throw new Error('Not authorized, no refresh token');
    }

    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
      
      // Generate new access token
      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '15m',
      });

      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = await this.userService.getAllUsers();
      res.status(200).json(allUsers);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req: any, res: Response, next: NextFunction) {
      try {
        const user = await this.userService.getUserByIdWithoutPassword(req.user._id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
      } catch (error) {
          next(error);
      }
  }

  async updateUserProfile(req: any, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getUserById(req.user._id);

      if (user) {
        // Update fields if present in body
        const updateData = { ...req.body };
        // Prevent password update via this route if needed, or handle it separately
        delete updateData.password; 
        delete updateData.email; // Usually email update requires verification

        const updatedUser = await this.userService.updateUser(req.user._id, updateData);
        
        res.json(updatedUser);
      } else {
        res.status(404);
        throw new Error('User not found');
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
