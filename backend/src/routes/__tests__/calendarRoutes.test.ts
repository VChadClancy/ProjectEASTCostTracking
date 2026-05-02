import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

describe('Calendar API route stubs', () => {
  it('GET /api/v1/fiscal-years returns 200', async () => {
    const res = await request(app).get('/api/v1/fiscal-years');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it('GET /api/v1/fiscal-periods returns 200', async () => {
    const res = await request(app).get('/api/v1/fiscal-periods');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it('GET /api/v1/holiday-calendars returns 200', async () => {
    const res = await request(app).get('/api/v1/holiday-calendars');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it('GET /api/v1/holiday-calendars/us/holidays returns 200', async () => {
    const res = await request(app).get('/api/v1/holiday-calendars/us/holidays');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
  it('GET /api/v1/programs/123/forecast-calendar-context returns 200', async () => {
    const res = await request(app).get('/api/v1/programs/123/forecast-calendar-context');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
