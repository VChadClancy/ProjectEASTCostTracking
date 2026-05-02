import express from 'express';
import { getResources, getResourceAvailability } from '../controllers/resourceController';

const router = express.Router();

// GET /api/v1/resources
router.get('/resources', getResources);
// GET /api/v1/resources/:resourceId/availability
router.get('/resources/:resourceId/availability', getResourceAvailability);

export default router;
