import express from 'express';
import { getProjectById, getProjectCARs } from '../controllers/projectController';

const router = express.Router();

// GET /api/v1/projects/:projectId
router.get('/:projectId', getProjectById);
// GET /api/v1/projects/:projectId/cars
router.get('/:projectId/cars', getProjectCARs);

export default router;
