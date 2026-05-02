import { Request, Response } from 'express';

// NOTE: These are stub handlers. Replace with database-backed services in the future.

export const getProjectById = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { projectId: req.params.projectId },
    message: 'Stub: Project details (replace with DB service)'
  });
};

export const getProjectCARs = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Stub: CARs for project (replace with DB service)'
  });
};
