import express from 'express';
import { searchJobsWithAI } from './chat.controller';
import { protect } from '../../middleware/auth.middleware'; // Assuming we want authenticated users only, or can remove if public

const router = express.Router();

router.post('/', protect, searchJobsWithAI);

export default router;
