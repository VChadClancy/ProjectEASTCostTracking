import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('CAR Routes', () => {
  it('GET /api/v1/cars/:carId returns stub', async () => {
    const res = await request(app).get('/api/v1/cars/789');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('carId', '789');
    expect(res.body.message).toMatch(/stub/i);
  });
});
