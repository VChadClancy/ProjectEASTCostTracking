import { describe, it, expect } from 'vitest';
import {
  getFinancialLines,
  getFinancialLineById,
  createFinancialLine,
  updateFinancialLine
} from './financialLineService';

const MOCK_ID = 'mock-test-id';

describe('financialLineService', () => {
  it('getFinancialLines returns mock lines', async () => {
    const lines = await getFinancialLines();
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

  it('filters work for programId, projectId, carId, and budgetStream', async () => {
    const all = await getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    expect((await getFinancialLines({ programId: sample.programId })).every(l => l.programId === sample.programId)).toBe(true);
    expect((await getFinancialLines({ projectId: sample.projectId })).every(l => l.projectId === sample.projectId)).toBe(true);
    expect((await getFinancialLines({ carId: sample.carId })).every(l => l.carId === sample.carId)).toBe(true);
    expect((await getFinancialLines({ budgetStream: sample.budgetStream })).every(l => l.budgetStream === sample.budgetStream)).toBe(true);
  });

  it('getFinancialLineById returns the expected line', async () => {
    const all = await getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    const found = await getFinancialLineById(sample.id);
    expect(found).not.toBeNull();
    if (!found) throw new Error('Line not found');
    expect(found.id).toBe(sample.id);
    expect(found.varianceAmount).toBe(found.actualAmount - found.forecastAmount);
  });

  it('missing line ID returns null', async () => {
    expect(await getFinancialLineById('__not_found__')).toBeNull();
  });

  it('createFinancialLine returns a line-like object with finite numbers', async () => {
    const input = {
      programId: 'p1',
      projectId: 'pr1',
      carId: 'c1',
      workstreamId: 'w1',
      fiscalPeriodId: 'fp1',
      amount: 100
    };
    const created = await createFinancialLine(input);
    expect(created).toMatchObject(input);
    expect(typeof created.id).toBe('string');
    expect(Number.isFinite(created.actualAmount)).toBe(true);
    expect(Number.isFinite(created.forecastAmount)).toBe(true);
    expect(Number.isFinite(created.varianceAmount)).toBe(true);
    expect(created.varianceAmount).toBe(created.actualAmount - created.forecastAmount);
  });

  it('updateFinancialLine returns an updated line-like object or null', async () => {
    const all = await getFinancialLines();
    if (!all.length) throw new Error('No mock data');
    const sample = all[0];
    // Provide all required fields for FinancialLineInput
    const updated = await updateFinancialLine(sample.id, {
      programId: sample.programId,
      projectId: sample.projectId,
      carId: sample.carId,
      workstreamId: sample.workstreamId,
      fiscalPeriodId: sample.fiscalPeriodId,
      amount: 999
    });
    expect(updated).not.toBeNull();
    if (!updated) throw new Error('Line not found');
    expect(updated.id).toBe(sample.id);
    expect(updated.actualAmount).toBe(999);
    expect(Number.isFinite(updated.varianceAmount)).toBe(true);
    expect(updated.varianceAmount).toBe(updated.actualAmount - updated.forecastAmount);
  });

  it('updateFinancialLine returns null for missing line', async () => {
    // Provide all required fields for FinancialLineInput
    expect(await updateFinancialLine('__not_found__', {
      programId: 'p1',
      projectId: 'pr1',
      carId: 'c1',
      workstreamId: 'w1',
      fiscalPeriodId: 'fp1',
      amount: 1
    })).toBeNull();
  });
});
