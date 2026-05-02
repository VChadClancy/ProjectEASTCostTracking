import express from 'express';
import { getWorkstreams } from '../controllers/workstreamController';

const router = express.Router();

// GET /api/v1/workstreams
router.get('/', getWorkstreams);

export default router;
