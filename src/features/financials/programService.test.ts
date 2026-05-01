import { describe, it, expect } from 'vitest';
import {
  getPrograms,
  getProjects,
  getCars,
  getWorkstreams,
  getFiscalYears,
  getFiscalPeriods
} from './programService';

describe('programService', () => {
  it('returns programs', () => {
    const programs = getPrograms();
    expect(programs.length).toBeGreaterThan(0);
    expect(programs[0].id).toBeDefined();
  });

  it('returns projects linked to a program', () => {
    const projects = getProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(projects[0].programId).toBeDefined();
    const programs = getPrograms();
    expect(programs.map(p => p.id)).toContain(projects[0].programId);
  });

  it('returns CARs linked to projects', () => {
    const cars = getCars();
    expect(cars.length).toBeGreaterThan(0);
    expect(cars[0].projectId).toBeDefined();
    const projects = getProjects();
    expect(projects.map(p => p.id)).toContain(cars[0].projectId);
  });

  it('returns fiscal years and periods', () => {
    const years = getFiscalYears();
    const periods = getFiscalPeriods();
    expect(years.length).toBeGreaterThan(0);
    expect(periods.length).toBeGreaterThan(0);
    expect(periods[0].fiscalYearId).toBeDefined();
    expect(years.map(y => y.id)).toContain(periods[0].fiscalYearId);
  });

  it('returns workstreams', () => {
    const workstreams = getWorkstreams();
    expect(workstreams.length).toBeGreaterThan(0);
    expect(workstreams[0].id).toBeDefined();
  });
});
