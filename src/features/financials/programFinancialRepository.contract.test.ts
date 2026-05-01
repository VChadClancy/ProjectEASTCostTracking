import { describe, it, expect, beforeAll } from 'vitest';
import type {
  ProgramFinancialRepository,
  Program,
  Project,
  Car,
  Workstream,
  FiscalYear,
  FiscalPeriod,
  FinancialLine,
  ProgramFinancialSummary,
} from './programFinancialRepository';
import { mockProgramFinancialRepository } from './mockProgramFinancialRepository';
import type { FinancialLine as FinancialLineFull } from './financialLineTypes';

// Reusable contract test suite for ProgramFinancialRepository
export function contractTestForProgramFinancialRepository(
  name: string,
  createRepo: () => ProgramFinancialRepository
) {
  describe(`${name} (ProgramFinancialRepository contract)`, () => {
    let repo: ProgramFinancialRepository;
    let programs: Program[];
    let projects: Project[];
    let cars: Car[];
    let workstreams: Workstream[];
    let fiscalYears: FiscalYear[];
    let fiscalPeriods: FiscalPeriod[];
    let financialLines: FinancialLine[];
    let summary: ProgramFinancialSummary;

    beforeAll(async () => {
      repo = createRepo();
      programs = await repo.getPrograms();
      projects = programs.length ? await repo.getProjects(programs[0].id) : [];
      cars = projects.length ? await repo.getCars(projects[0].id) : [];
      workstreams = await repo.getWorkstreams();
      fiscalYears = await repo.getFiscalYears();
      fiscalPeriods = fiscalYears.length ? await repo.getFiscalPeriods(fiscalYears[0].id) : [];
      financialLines = await repo.getFinancialLines();
      summary = programs.length ? await repo.getProgramFinancialSummary(programs[0].id) : ({} as any);
    });

    it('getPrograms returns an array with at least one program', () => {
      expect(Array.isArray(programs)).toBe(true);
      expect(programs.length).toBeGreaterThan(0);
    });

    it('getProjects returns projects linked to the selected program', () => {
      expect(Array.isArray(projects)).toBe(true);
      if (programs.length) {
        expect(projects.every(p => p.programId === programs[0].id)).toBe(true);
      }
    });

    it('getCars returns CARs linked to a selected project', () => {
      expect(Array.isArray(cars)).toBe(true);
      if (projects.length) {
        expect(cars.every(car => car.projectId === projects[0].id)).toBe(true);
      }
    });

    it('getWorkstreams returns an array', () => {
      expect(Array.isArray(workstreams)).toBe(true);
    });

    it('getFiscalYears returns an array', () => {
      expect(Array.isArray(fiscalYears)).toBe(true);
    });

    it('getFiscalPeriods returns periods linked to a selected fiscal year', () => {
      expect(Array.isArray(fiscalPeriods)).toBe(true);
      if (fiscalYears.length) {
        expect(fiscalPeriods.every(fp => fp.fiscalYearId === fiscalYears[0].id)).toBe(true);
      }
    });

    it('getFinancialLines returns lines with finite numeric forecast, actual, and variance values', () => {
      expect(Array.isArray(financialLines)).toBe(true);
      for (const line of financialLines as FinancialLineFull[]) {
        expect(Number.isFinite(line.forecastAmount)).toBe(true);
        expect(Number.isFinite(line.actualAmount)).toBe(true);
        expect(Number.isFinite(line.varianceAmount)).toBe(true);
      }
    });

    it('getProgramFinancialSummary returns a summary for the selected program', () => {
      if (programs.length) {
        expect(summary).toBeDefined();
        expect(summary.programId).toBe(programs[0].id);
      }
    });
  });
}

// Run contract tests against the mock repository only (for now)
contractTestForProgramFinancialRepository('mockProgramFinancialRepository', () => mockProgramFinancialRepository);
