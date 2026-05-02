import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('Workstream Routes', () => {
  it('GET /api/v1/workstreams returns stub', async () => {
    const res = await request(app).get('/api/v1/workstreams');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toMatch(/stub/i);
  });
});
