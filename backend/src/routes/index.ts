import { Router } from 'express';
import healthRoutes from './healthRoutes';
import programRoutes from './programRoutes';
import projectRoutes from './projectRoutes';
import carRoutes from './carRoutes';
import workstreamRoutes from './workstreamRoutes';

const router = Router();

router.use('/health', healthRoutes);

// v1 API route groups
router.use('/v1/programs', programRoutes);
router.use('/v1/projects', projectRoutes);
router.use('/v1/cars', carRoutes);
router.use('/v1/workstreams', workstreamRoutes);

export default router;
