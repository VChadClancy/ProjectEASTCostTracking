import { Request, Response } from 'express';

// NOTE: These are stub handlers. Replace with database-backed services in the future.

export const getPrograms = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Stub: List of programs (replace with DB service)'
  });
};

export const getProgramById = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { programId: req.params.programId },
    message: 'Stub: Program details (replace with DB service)'
  });
};

export const getProgramProjects = (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    message: 'Stub: Projects for program (replace with DB service)'
  });
};
