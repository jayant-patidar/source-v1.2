import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (res: Response, userId: Types.ObjectId | string) => {
  const isProduction = process.env.NODE_ENV !== 'development';

  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'refresh_secret', {
    expiresIn: '7d',
  });

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

export default generateToken;
