import express from 'express';
import { getCARById } from '../controllers/carController';

const router = express.Router();

// GET /api/v1/cars/:carId
router.get('/:carId', getCARById);

export default router;
