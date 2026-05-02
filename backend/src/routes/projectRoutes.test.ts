import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('Project Routes', () => {
  it('GET /api/v1/projects/:projectId returns stub', async () => {
    const res = await request(app).get('/api/v1/projects/456');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('projectId', '456');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('GET /api/v1/projects/:projectId/cars returns stub', async () => {
    const res = await request(app).get('/api/v1/projects/456/cars');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/stub/i);
  });
});
