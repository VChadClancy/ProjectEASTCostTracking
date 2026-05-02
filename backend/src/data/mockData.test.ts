import { describe, it, expect } from 'vitest';
import * as data from './index';

describe('Mock Data Exports', () => {
  it('exports programs, projects, cars, workstreams, resources, resourceAvailability', () => {
    expect(Array.isArray(data.programs)).toBe(true);
    expect(Array.isArray(data.projects)).toBe(true);
    expect(Array.isArray(data.cars)).toBe(true);
    expect(Array.isArray(data.workstreams)).toBe(true);
    expect(Array.isArray(data.resources)).toBe(true);
    expect(Array.isArray(data.resourceAvailability)).toBe(true);
  });
  it('exports financialLines', () => {
    expect(Array.isArray(data.financialLines)).toBe(true);
  });
  it('exports fiscalYears, fiscalPeriods, holidayCalendars, holidays', () => {
    expect(Array.isArray(data.fiscalYears)).toBe(true);
    expect(Array.isArray(data.fiscalPeriods)).toBe(true);
    expect(Array.isArray(data.holidayCalendars)).toBe(true);
    expect(Array.isArray(data.holidays)).toBe(true);
  });
});

describe('Mock Data Relationships', () => {
  it('all projects link to a valid program', () => {
    const programIds = new Set(data.programs.map(p => p.id));
    for (const project of data.projects) {
      expect(programIds.has(project.programId)).toBe(true);
    }
  });
  it('all CARs link to a valid project', () => {
    const projectIds = new Set(data.projects.map(p => p.id));
    for (const car of data.cars) {
      expect(projectIds.has(car.projectId)).toBe(true);
    }
  });
  it('all workstreams link to a valid CAR', () => {
    const carIds = new Set(data.cars.map(c => c.id));
    for (const ws of data.workstreams) {
      expect(carIds.has(ws.carId)).toBe(true);
    }
  });
  it('all financialLines link to a valid program', () => {
    const programIds = new Set(data.programs.map(p => p.id));
    for (const fl of data.financialLines) {
      expect(programIds.has(fl.programId)).toBe(true);
    }
  });
  it('all fiscalPeriods link to a valid fiscalYear', () => {
    const fyIds = new Set(data.fiscalYears.map(fy => fy.id));
    for (const fp of data.fiscalPeriods) {
      expect(fyIds.has(fp.fiscalYearId)).toBe(true);
    }
  });
  it('all holidays link to a valid holidayCalendar', () => {
    const calIds = new Set(data.holidayCalendars.map(c => c.id));
    for (const h of data.holidays) {
      expect(calIds.has(h.calendarId)).toBe(true);
    }
  });
});
