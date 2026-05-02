import { Request, Response } from 'express';

// NOTE: This is a stub handler. Replace with database-backed services in the future.

export const getCARById = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { carId: req.params.carId },
    message: 'Stub: CAR details (replace with DB service)'
  });
};
