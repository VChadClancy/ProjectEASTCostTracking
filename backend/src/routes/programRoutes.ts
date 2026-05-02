import express from 'express';
import { getPrograms, getProgramById, getProgramProjects } from '../controllers/programController';

const router = express.Router();

// GET /api/v1/programs
router.get('/', getPrograms);
// GET /api/v1/programs/:programId
router.get('/:programId', getProgramById);
// GET /api/v1/programs/:programId/projects
router.get('/:programId/projects', getProgramProjects);

export default router;
