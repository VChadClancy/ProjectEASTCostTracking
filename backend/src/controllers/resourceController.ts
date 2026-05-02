// Resource controller stubs for calendar-aware forecasting
import { Request, Response } from 'express';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export const getResources = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Stub: Resources endpoint. Replace with database-backed service.',
    data: [
      { id: 'r1', name: 'Alice Example' },
      { id: 'r2', name: 'Bob Example' },
    ],
  };
  res.json(response);
};

export const getResourceAvailability = (req: Request, res: Response) => {
  const { resourceId } = req.params;
  const response: ApiResponse = {
    success: true,
    message: `Stub: Availability for resource ${resourceId}. Replace with database-backed service.`,
    data: [
      { date: '2024-05-01', available: true },
      { date: '2024-05-02', available: false },
    ],
  };
  res.json(response);
};
