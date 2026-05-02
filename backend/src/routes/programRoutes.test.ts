import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('Program Routes', () => {
  it('GET /api/v1/programs returns stub', async () => {
    const res = await request(app).get('/api/v1/programs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('GET /api/v1/programs/:programId returns stub', async () => {
    const res = await request(app).get('/api/v1/programs/123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('programId', '123');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('GET /api/v1/programs/:programId/projects returns stub', async () => {
    const res = await request(app).get('/api/v1/programs/123/projects');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/stub/i);
  });
});
