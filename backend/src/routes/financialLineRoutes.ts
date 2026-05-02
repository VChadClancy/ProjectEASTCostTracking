import express from 'express';
import {
  getFinancialLines,
  getFinancialLineById,
  createFinancialLine,
  updateFinancialLine
} from '../controllers/financialLineController';

const router = express.Router();

// GET /api/v1/financial-lines
router.get('/', getFinancialLines);
// GET /api/v1/financial-lines/:lineId
router.get('/:lineId', getFinancialLineById);
// POST /api/v1/financial-lines
router.post('/', createFinancialLine);
// PUT /api/v1/financial-lines/:lineId
router.put('/:lineId', updateFinancialLine);

export default router;
