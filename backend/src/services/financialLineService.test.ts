import { describe, it, expect } from 'vitest';
import {
  getFinancialLines,
  getFinancialLineById,
  createFinancialLine,
  updateFinancialLine
} from './financialLineService';

const MOCK_ID = 'mock-test-id';

describe('financialLineService', () => {
  it('getFinancialLines returns mock lines', () => {
    const lines = getFinancialLines();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) {
      expect(typeof l.id).toBe('string');
      expect(Number.isFinite(l.actualAmount)).toBe(true);
      expect(Number.isFinite(l.forecastAmount)).toBe(true);
      expect(Number.isFinite(l.varianceAmount)).toBe(true);
      expect(l.varianceAmount).toBe(l.actualAmount - l.forecastAmount);
    }
  });

  it('filters work for programId, projectId, carId, and budgetStream', () => {
    const all = getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    expect(getFinancialLines({ programId: sample.programId }).every(l => l.programId === sample.programId)).toBe(true);
    expect(getFinancialLines({ projectId: sample.projectId }).every(l => l.projectId === sample.projectId)).toBe(true);
    expect(getFinancialLines({ carId: sample.carId }).every(l => l.carId === sample.carId)).toBe(true);
    expect(getFinancialLines({ budgetStream: sample.budgetStream }).every(l => l.budgetStream === sample.budgetStream)).toBe(true);
  });

  it('getFinancialLineById returns the expected line', () => {
    const all = getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    const found = getFinancialLineById(sample.id);
    expect(found).not.toBeNull();
    if (!found) throw new Error('Line not found');
    expect(found.id).toBe(sample.id);
    expect(found.varianceAmount).toBe(found.actualAmount - found.forecastAmount);
  });

  it('missing line ID returns null', () => {
    expect(getFinancialLineById('__not_found__')).toBeNull();
  });

  it('createFinancialLine returns a line-like object with finite numbers', () => {
    const input = {
      programId: 'p1',
      projectId: 'pr1',
      carId: 'c1',
      workstreamId: 'w1',
      fiscalYearId: 'fy1',
      fiscalPeriodId: 'fp1',
      budgetStream: 'CapEx',
      actualAmount: 100,
      forecastAmount: 80
    };
    const created = createFinancialLine(input);
    expect(created).toMatchObject(input);
    expect(typeof created.id).toBe('string');
    expect(Number.isFinite(created.actualAmount)).toBe(true);
    expect(Number.isFinite(created.forecastAmount)).toBe(true);
    expect(Number.isFinite(created.varianceAmount)).toBe(true);
    expect(created.varianceAmount).toBe(created.actualAmount - created.forecastAmount);
  });

  it('updateFinancialLine returns an updated line-like object or null', () => {
    const all = getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    const updated = updateFinancialLine(sample.id, { actualAmount: 999 });
    expect(updated).not.toBeNull();
    if (!updated) throw new Error('Line not found');
    expect(updated.id).toBe(sample.id);
    expect(updated.actualAmount).toBe(999);
    expect(Number.isFinite(updated.varianceAmount)).toBe(true);
    expect(updated.varianceAmount).toBe(updated.actualAmount - updated.forecastAmount);
  });

  it('updateFinancialLine returns null for missing line', () => {
    expect(updateFinancialLine('__not_found__', { actualAmount: 1 })).toBeNull();
  });
});
