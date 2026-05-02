import { describe, it, expect } from 'vitest';
import { mockFinancialLineRepository } from './mockFinancialLineRepository';

describe('mockFinancialLineRepository', () => {
  it('returns all financial lines', async () => {
    const lines = await mockFinancialLineRepository.getFinancialLines();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('filters by programId', async () => {
    const all = await mockFinancialLineRepository.getFinancialLines();
    const one = await mockFinancialLineRepository.getFinancialLines({ programId: all[0].programId });
    expect(one.every(l => l.programId === all[0].programId)).toBe(true);
  });

  it('returns a financial line by id', async () => {
    const all = await mockFinancialLineRepository.getFinancialLines();
    const found = await mockFinancialLineRepository.getFinancialLineById(all[0].id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(all[0].id);
  });

  it('creates a financial line', async () => {
    const input = {
      programId: 'program-1',
      projectId: 'project-1',
      carId: 'car-1',
      workstreamId: 'ws-1',
      fiscalPeriodId: 'P1',
      amount: 123.45,
    };
    const created = await mockFinancialLineRepository.createFinancialLine(input);
    expect(created).toMatchObject({ ...input, actualAmount: input.amount });
    expect(typeof created.id).toBe('string');
  });

  it('updates a financial line', async () => {
    const all = await mockFinancialLineRepository.getFinancialLines();
    const updated = await mockFinancialLineRepository.updateFinancialLine(all[0].id, { ...all[0], amount: 999 });
    expect(updated).toBeDefined();
    expect(updated?.actualAmount).toBe(999);
  });

  it('varianceAmount is actualAmount - forecastAmount and finite', async () => {
    const all = await mockFinancialLineRepository.getFinancialLines();
    for (const l of all) {
      expect(typeof l.varianceAmount).toBe('number');
      expect(Number.isFinite(l.varianceAmount)).toBe(true);
      expect(l.varianceAmount).toBe(l.actualAmount - l.forecastAmount);
    }
  });
});
