import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Program forecast calendar context route stub', () => {
  it('GET /api/v1/programs/abc/forecast-calendar-context returns 200', async () => {
    const res = await request(app).get('/api/v1/programs/abc/forecast-calendar-context');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
