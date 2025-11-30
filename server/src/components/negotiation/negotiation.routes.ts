import express from 'express';
import negotiationController from './negotiation.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, negotiationController.createNegotiation.bind(negotiationController));
router.get('/my-offers', protect, negotiationController.getNegotiationsByUser.bind(negotiationController));
router.get('/:jobId', protect, negotiationController.getNegotiations.bind(negotiationController));
router.put('/:id', protect, negotiationController.updateNegotiationStatus.bind(negotiationController));

export default router;
