import { describe, it, expect } from 'vitest';
import { MockProgramPlanningRepository } from './mockProgramPlanningRepository';
import { MockFinancialLineRepository } from './mockFinancialLineRepository';
import { MockCalendarCapacityRepository } from './mockCalendarCapacityRepository';

// Helper: check that missing lookups return undefined/null
async function expectMissingIsNullish(fn: () => Promise<any>) {
  const result = await fn();
  expect(result === undefined || result === null).toBe(true);
}

describe('Repository Contract Tests', () => {
  describe('MockProgramPlanningRepository', () => {
    const repo = new MockProgramPlanningRepository();

    it('returns programs', async () => {
      const programs = await repo.getPrograms();
      expect(Array.isArray(programs)).toBe(true);
      expect(programs.length).toBeGreaterThan(0);
    });

    it('returns projects', async () => {
      const projects = await repo.getProjects();
      expect(Array.isArray(projects)).toBe(true);
    });

    it('returns CARs', async () => {
      const cars = await repo.getCars();
      expect(Array.isArray(cars)).toBe(true);
    });

    it('returns workstreams', async () => {
      const workstreams = await repo.getWorkstreams();
      expect(Array.isArray(workstreams)).toBe(true);
    });

    it('missing single-record lookups return undefined/null', async () => {
      await expectMissingIsNullish(() => repo.getProgramById('not-a-real-id'));
      await expectMissingIsNullish(() => repo.getProjectById('not-a-real-id'));
      await expectMissingIsNullish(() => repo.getCarById('not-a-real-id'));
      // No getWorkstreamById method in mock, so skip
    });
  });

  describe('MockFinancialLineRepository', () => {
    const repo = new MockFinancialLineRepository();

    it('returns financial lines', async () => {
      const lines = await repo.getFinancialLines();
      expect(Array.isArray(lines)).toBe(true);
      expect(lines.length).toBeGreaterThan(0);
    });

    it('supports filters', async () => {
      const all = await repo.getFinancialLines();
      if (all.length > 0) {
        const filtered = await repo.getFinancialLines({ programId: all[0].programId });
        expect(filtered.every(l => l.programId === all[0].programId)).toBe(true);
      }
    });

    it('create/update returns mock-safe line-like objects', async () => {
      const created = await repo.createFinancialLine({
        programId: 'test',
        projectId: 'test',
        carId: 'test',
        workstreamId: 'test',
        fiscalPeriodId: 'test',
        amount: 100,
      });
      expect(created).toHaveProperty('id');
      expect(created).toHaveProperty('amount');
      expect(created).toHaveProperty('varianceAmount');

      const updated = await repo.updateFinancialLine(created.id, { amount: 200 });
      expect(updated).toHaveProperty('id', created.id);
      expect(updated).toHaveProperty('amount', 200);
    });

    it('varianceAmount equals actualAmount minus forecastAmount', async () => {
      // The mock sets actualAmount = amount, forecastAmount = 0
      const line = await repo.createFinancialLine({
        programId: 'test',
        projectId: 'test',
        carId: 'test',
        workstreamId: 'test',
        fiscalPeriodId: 'test',
        amount: 5,
      });
      expect(line.varianceAmount).toBe(line.actualAmount - line.forecastAmount);
    });

    it('missing single-record lookups return undefined/null', async () => {
      await expectMissingIsNullish(() => repo.getFinancialLineById('not-a-real-id'));
    });
  });

  describe('MockCalendarCapacityRepository', () => {
    const repo = new MockCalendarCapacityRepository();

    it('returns fiscal years', async () => {
      const years = await repo.getFiscalYears();
      expect(Array.isArray(years)).toBe(true);
    });

    it('returns fiscal periods', async () => {
      const periods = await repo.getFiscalPeriods();
      expect(Array.isArray(periods)).toBe(true);
    });

    it('returns holiday calendars', async () => {
      const holidays = await repo.getHolidayCalendars();
      expect(Array.isArray(holidays)).toBe(true);
    });

    it('returns resources', async () => {
      const resources = await repo.getResources();
      expect(Array.isArray(resources)).toBe(true);
    });

    it('returns forecast calendar context', async () => {
      // programId is required, but mock ignores it
      const context = await repo.getForecastCalendarContext('test-program');
      expect(context).toBeDefined();
      expect(context).toHaveProperty('fiscalYears');
      expect(context).toHaveProperty('fiscalPeriods');
    });

    it('missing single-record lookups return undefined/null', async () => {
      // No getFiscalYearById, getFiscalPeriodById, or getResourceById in mock, so skip
      // Could add if implemented in future
    });
  });
});
