import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('GET /api/health', () => {
  it('should return 200 and health info', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('status', 'ok');
    expect(res.body.data).toHaveProperty('service');
    expect(typeof res.body.data.service).toBe('string');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(typeof res.body.data.timestamp).toBe('string');
    expect(res.body.data).toHaveProperty('version');
    expect(typeof res.body.data.version).toBe('string');
  });
});
