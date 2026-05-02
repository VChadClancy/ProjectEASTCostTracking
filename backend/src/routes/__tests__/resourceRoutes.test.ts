import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Resource API route stubs', () => {
  it('GET /api/v1/resources returns 200', async () => {
    const res = await request(app).get('/api/v1/resources');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it('GET /api/v1/resources/r1/availability returns 200', async () => {
    const res = await request(app).get('/api/v1/resources/r1/availability');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
