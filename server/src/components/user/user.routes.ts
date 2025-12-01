import express from 'express';
import userController from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

// Auth Routes
router.post('/register', userController.createUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/logout', userController.logoutUser.bind(userController));
router.post('/refresh', userController.refreshToken.bind(userController));
router.get('/profile', protect, userController.getUserProfile.bind(userController));
router.put('/profile', protect, userController.updateUserProfile.bind(userController));
router.post('/saved/:jobId', protect, userController.toggleSavedJob.bind(userController));
router.get('/saved', protect, userController.getSavedJobs.bind(userController));

// User Management Routes
router.get('/', protect, userController.getAllUsers.bind(userController));
router.get('/:id', protect, userController.getPublicUserById.bind(userController));

export default router;
