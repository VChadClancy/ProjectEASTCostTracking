import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('Financial Line Routes', () => {
  it('GET /api/v1/financial-lines returns stub', async () => {
    const res = await request(app).get('/api/v1/financial-lines');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('GET /api/v1/financial-lines/:lineId returns stub', async () => {
    const res = await request(app).get('/api/v1/financial-lines/123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('lineId', '123');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('POST /api/v1/financial-lines returns stub', async () => {
    const res = await request(app)
      .post('/api/v1/financial-lines')
      .send({ name: 'Test Line', amount: 100 });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('name', 'Test Line');
    expect(res.body.message).toMatch(/stub/i);
  });

  it('PUT /api/v1/financial-lines/:lineId returns stub', async () => {
    const res = await request(app)
      .put('/api/v1/financial-lines/123')
      .send({ name: 'Updated Line', amount: 200 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('name', 'Updated Line');
    expect(res.body.data).toHaveProperty('lineId', '123');
    expect(res.body.message).toMatch(/stub/i);
  });
});
