import { describe, it, expect } from 'vitest';
import { mockProgramFinancialRepository } from './mockProgramFinancialRepository';

// These are assumed to exist in the mock services:
// - at least one program, project, car, workstream, fiscal year, fiscal period, financial line, and summary

describe('mockProgramFinancialRepository', () => {
  it('returns programs', async () => {
    const programs = await mockProgramFinancialRepository.getPrograms();
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBeGreaterThan(0);
  });

  it('filters projects by programId', async () => {
    const programs = await mockProgramFinancialRepository.getPrograms();
    const programId = programs[0].id;
    const projects = await mockProgramFinancialRepository.getProjects(programId);
    expect(projects.every(p => p.programId === programId)).toBe(true);
  });

  it('filters cars by projectId', async () => {
    const projects = await mockProgramFinancialRepository.getProjects();
    const projectId = projects[0].id;
    const cars = await mockProgramFinancialRepository.getCars(projectId);
    expect(cars.every(c => c.projectId === projectId)).toBe(true);
  });

  it('filters fiscal periods by fiscalYearId', async () => {
    const fiscalYears = await mockProgramFinancialRepository.getFiscalYears();
    const fiscalYearId = fiscalYears[0].id;
    const periods = await mockProgramFinancialRepository.getFiscalPeriods(fiscalYearId);
    expect(periods.every(p => p.fiscalYearId === fiscalYearId)).toBe(true);
  });

  it('returns financial lines', async () => {
    const lines = await mockProgramFinancialRepository.getFinancialLines();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('returns program financial summary', async () => {
    const programs = await mockProgramFinancialRepository.getPrograms();
    const summary = await mockProgramFinancialRepository.getProgramFinancialSummary(programs[0].id);
    expect(summary).toBeDefined();
    expect(summary.programId).toBe(programs[0].id);
  });
});
