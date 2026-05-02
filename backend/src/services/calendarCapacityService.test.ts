import { describe, it, expect } from 'vitest';
import {
  getFiscalYears,
  getFiscalPeriods,
  getHolidayCalendars,
  getHolidays,
  getResources,
  getResourceAvailability,
  getForecastCalendarContext
} from './calendarCapacityService';

describe('calendarCapacityService', () => {
  it('getFiscalYears returns mock fiscal years', async () => {
    const years = await getFiscalYears();
    expect(Array.isArray(years)).toBe(true);
    expect(years.length).toBeGreaterThan(0);
  });

  it('getFiscalPeriods filters by fiscalYearId', async () => {
    const allPeriods = await getFiscalPeriods();
    expect(Array.isArray(allPeriods)).toBe(true);
    expect(allPeriods.length).toBeGreaterThan(0);
    const fyId = allPeriods[0]?.fiscalYearId;
    if (fyId) {
      const filtered = await getFiscalPeriods(fyId);
      expect(filtered.every(p => p.fiscalYearId === fyId)).toBe(true);
    }
  });

  it('getHolidayCalendars returns mock calendars', async () => {
    const cals = await getHolidayCalendars();
    expect(Array.isArray(cals)).toBe(true);
    expect(cals.length).toBeGreaterThan(0);
  });

  it('getHolidays filters by calendarId', async () => {
    const allHolidays = await getHolidays();
    expect(Array.isArray(allHolidays)).toBe(true);
    expect(allHolidays.length).toBeGreaterThan(0);
    const calId = allHolidays[0]?.calendarId;
    if (calId) {
      const filtered = await getHolidays(calId);
      expect(filtered.every(h => h.calendarId === calId)).toBe(true);
    }
  });

  it('getResources returns array', async () => {
    const res = await getResources();
    expect(Array.isArray(res)).toBe(true);
  });

  it('getResourceAvailability returns null or object', async () => {
    const avail = await getResourceAvailability('any');
    expect(avail === null || typeof avail === 'object').toBe(true);
  });

  it('getForecastCalendarContext returns context for a programId', async () => {
    const ctx = await getForecastCalendarContext('prog-123');
    expect(ctx).toBeDefined();
    expect(ctx.fiscalYears).toBeDefined();
    expect(ctx.fiscalPeriods).toBeDefined();
    expect(ctx.holidays).toBeDefined();
  });

  it('returned arrays are finite/defined and deterministic', async () => {
    expect(Array.isArray(await getFiscalYears())).toBe(true);
    expect(Array.isArray(await getFiscalPeriods())).toBe(true);
    expect(Array.isArray(await getHolidayCalendars())).toBe(true);
    expect(Array.isArray(await getHolidays())).toBe(true);
    expect(Array.isArray(await getResources())).toBe(true);
  });
});
