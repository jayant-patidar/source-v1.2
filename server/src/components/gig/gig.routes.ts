import express from 'express';
import gigController from './gig.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, gigController.createGig.bind(gigController));
router.get('/', gigController.getGigs.bind(gigController));
router.get('/my', protect, gigController.getMyGigs.bind(gigController));
router.get('/:id', gigController.getGigById.bind(gigController));
router.put('/:id', protect, gigController.updateGig.bind(gigController));
router.delete('/:id', protect, gigController.deleteGig.bind(gigController));
router.post('/:id/book', protect, gigController.bookGig.bind(gigController));

export default router;
