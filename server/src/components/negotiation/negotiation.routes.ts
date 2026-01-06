import express from 'express';
import negotiationController from './negotiation.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, (req, res, next) => negotiationController.createNegotiation(req, res, next));
router.get('/my-offers', protect, (req, res, next) => negotiationController.getNegotiationsByUser(req, res, next));
router.get('/received', protect, (req, res, next) => negotiationController.getNegotiationsReceived(req, res, next));
router.get('/:jobId', protect, (req, res, next) => negotiationController.getNegotiations(req, res, next));
router.put('/:id', protect, (req, res, next) => negotiationController.updateNegotiationStatus(req, res, next));
router.put('/:id/counter', protect, (req, res, next) => negotiationController.counterOffer(req, res, next));

export default router;
