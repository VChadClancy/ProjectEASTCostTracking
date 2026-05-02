import { Request, Response } from 'express';

// NOTE: These are stub handlers. Replace with database-backed services in the future.

export const getFinancialLines = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Stub: List of financial lines (replace with DB service)'
  });
};

export const getFinancialLineById = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { lineId: req.params.lineId },
    message: 'Stub: Financial line details (replace with DB service)'
  });
};

export const createFinancialLine = (req: Request, res: Response) => {
  try {
    // Accept body, but do not persist. Return what was sent.
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
    res.status(201).json({
      success: true,
      data: body,
      message: 'Stub: Financial line created (not persisted, replace with DB service)'
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      data: {},
      message: 'Stub: Failed to create financial line (controller error, still a stub, not persisted)'
    });
  }
};

export const updateFinancialLine = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { ...req.body, lineId: req.params.lineId },
    message: 'Stub: Financial line updated (not persisted, replace with DB service)'
  });
};
