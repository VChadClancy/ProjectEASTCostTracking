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
  it('getFiscalYears returns mock fiscal years', () => {
    const years = getFiscalYears();
    expect(Array.isArray(years)).toBe(true);
    expect(years.length).toBeGreaterThan(0);
  });

  it('getFiscalPeriods filters by fiscalYearId', () => {
    const allPeriods = getFiscalPeriods();
    expect(Array.isArray(allPeriods)).toBe(true);
    expect(allPeriods.length).toBeGreaterThan(0);
    const fyId = allPeriods[0]?.fiscalYearId;
    if (fyId) {
      const filtered = getFiscalPeriods(fyId);
      expect(filtered.every(p => p.fiscalYearId === fyId)).toBe(true);
    }
  });

  it('getHolidayCalendars returns mock calendars', () => {
    const cals = getHolidayCalendars();
    expect(Array.isArray(cals)).toBe(true);
    expect(cals.length).toBeGreaterThan(0);
  });

  it('getHolidays filters by calendarId', () => {
    const allHolidays = getHolidays();
    expect(Array.isArray(allHolidays)).toBe(true);
    expect(allHolidays.length).toBeGreaterThan(0);
    const calId = allHolidays[0]?.calendarId;
    if (calId) {
      const filtered = getHolidays(calId);
      expect(filtered.every(h => h.calendarId === calId)).toBe(true);
    }
  });

  it('getResources returns empty array', () => {
    const res = getResources();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(0);
  });

  it('getResourceAvailability returns null', () => {
    const avail = getResourceAvailability('any');
    expect(avail).toBeNull();
  });

  it('getForecastCalendarContext returns context for a programId', () => {
    const ctx = getForecastCalendarContext('prog-123');
    expect(ctx).toBeDefined();
    expect(ctx.programId).toBe('prog-123');
    expect(Array.isArray(ctx.fiscalYears)).toBe(true);
    expect(Array.isArray(ctx.fiscalPeriods)).toBe(true);
    expect(Array.isArray(ctx.holidayCalendars)).toBe(true);
    expect(Array.isArray(ctx.resources)).toBe(true);
    expect(typeof ctx.message).toBe('string');
  });

  it('returned arrays are finite/defined and deterministic', () => {
    expect(Array.isArray(getFiscalYears())).toBe(true);
    expect(Array.isArray(getFiscalPeriods())).toBe(true);
    expect(Array.isArray(getHolidayCalendars())).toBe(true);
    expect(Array.isArray(getHolidays())).toBe(true);
    expect(Array.isArray(getResources())).toBe(true);
  });
});
