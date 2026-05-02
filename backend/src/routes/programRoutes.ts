import express from 'express';
import { getPrograms, getProgramById, getProgramProjects } from '../controllers/programController';
import { getProgramForecastCalendarContext } from '../controllers/calendarController';

const router = express.Router();

// GET /api/v1/programs
router.get('/', getPrograms);
// GET /api/v1/programs/:programId
router.get('/:programId', getProgramById);
// GET /api/v1/programs/:programId/projects
router.get('/:programId/projects', getProgramProjects);
// GET /api/v1/programs/:programId/forecast-calendar-context
router.get('/:programId/forecast-calendar-context', getProgramForecastCalendarContext);

export default router;
