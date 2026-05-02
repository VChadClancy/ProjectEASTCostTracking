import { describe, it, expect } from 'vitest';
import { mockCalendarCapacityRepository } from './mockCalendarCapacityRepository';

describe('mockCalendarCapacityRepository', () => {
  it('returns all fiscal years', async () => {
    const fiscalYears = await mockCalendarCapacityRepository.getFiscalYears();
    expect(Array.isArray(fiscalYears)).toBe(true);
    expect(fiscalYears.length).toBeGreaterThan(0);
  });

  it('returns all fiscal periods', async () => {
    const periods = await mockCalendarCapacityRepository.getFiscalPeriods();
    expect(Array.isArray(periods)).toBe(true);
    expect(periods.length).toBeGreaterThan(0);
  });

  it('returns all holiday calendars', async () => {
    const calendars = await mockCalendarCapacityRepository.getHolidayCalendars();
    expect(Array.isArray(calendars)).toBe(true);
    expect(calendars.length).toBeGreaterThan(0);
  });

  it('returns all holidays', async () => {
    const holidays = await mockCalendarCapacityRepository.getHolidays();
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
  });

  it('returns all resources', async () => {
    const resources = await mockCalendarCapacityRepository.getResources();
    expect(Array.isArray(resources)).toBe(true);
    expect(resources.length).toBeGreaterThan(0);
  });

  it('returns resource availability', async () => {
    const resources = await mockCalendarCapacityRepository.getResources();
    const avail = await mockCalendarCapacityRepository.getResourceAvailability(resources[0].id);
    expect(avail).toBeDefined();
    expect(avail.resourceId).toBe(resources[0].id);
  });

  it('returns forecast calendar context', async () => {
    const context = await mockCalendarCapacityRepository.getForecastCalendarContext('program-1');
    expect(context).toHaveProperty('fiscalYears');
    expect(context).toHaveProperty('fiscalPeriods');
    expect(context).toHaveProperty('holidays');
  });
});
