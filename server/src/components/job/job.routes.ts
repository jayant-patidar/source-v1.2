import express from 'express';
import jobController from './job.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, jobController.createJob.bind(jobController));
router.get('/', jobController.getAllJobs.bind(jobController));
router.get('/:id', jobController.getJobById.bind(jobController));
router.put('/:id', protect, jobController.updateJob.bind(jobController));
router.delete('/:id', protect, jobController.deleteJob.bind(jobController));

export default router;
