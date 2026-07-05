import express from 'express';
import jobController from './job.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, jobController.createJob.bind(jobController));
router.get('/posted', protect, jobController.getJobsByPoster.bind(jobController));
router.get('/worked', protect, jobController.getJobsByProvider.bind(jobController));
router.get('/archived', protect, jobController.getArchivedJobs.bind(jobController));
router.get('/cancelled', protect, jobController.getCancelledJobs.bind(jobController));
router.get('/expired', protect, jobController.getExpiredJobs.bind(jobController));
router.get('/', jobController.getAllJobs.bind(jobController));
router.get('/:id', jobController.getJobById.bind(jobController));
router.put('/:id', protect, jobController.updateJob.bind(jobController));
router.put('/:id/start', protect, jobController.startJob.bind(jobController));
router.put('/:id/approve-start', protect, jobController.approveStart.bind(jobController));
router.put('/:id/decline-start', protect, jobController.declineStart.bind(jobController));
router.put('/:id/archive', protect, jobController.archiveJob.bind(jobController));
router.put('/:id/unarchive', protect, jobController.unarchiveJob.bind(jobController));
router.put('/:id/repost', protect, jobController.repostJob.bind(jobController));

router.delete('/:id', protect, jobController.deleteJob.bind(jobController));

export default router;
