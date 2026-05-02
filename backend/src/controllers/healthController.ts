import { Request, Response } from 'express';
import { ApiResponse } from '../types/apiTypes';
import pkg from '../../package.json';

const SERVICE_NAME = 'epfos-backend';
const VERSION = pkg.version || '0.1.0';

export function healthCheck(req: Request, res: Response) {
  const response: ApiResponse<any> = {
    success: true,
    data: {
      status: 'ok',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString(),
      version: VERSION,
    },
  };
  res.status(200).json(response);
}
