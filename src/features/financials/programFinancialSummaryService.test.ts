import { describe, it, expect } from 'vitest';
import { getProgramFinancialSummary } from './programFinancialSummaryService';

describe('getProgramFinancialSummary', () => {
  const summary = getProgramFinancialSummary();

  it('includes the mock program', () => {
    expect(summary.program).toBeTruthy();
    expect(summary.program.id).toBeTruthy();
    expect(summary.program.name).toBeTruthy();
  });

  it('includes project, CAR, and workstream counts', () => {
    expect(typeof summary.projectCount).toBe('number');
    expect(typeof summary.carCount).toBe('number');
    expect(typeof summary.workstreamCount).toBe('number');
    expect(summary.projectCount).toBeGreaterThanOrEqual(0);
    expect(summary.carCount).toBeGreaterThanOrEqual(0);
    expect(summary.workstreamCount).toBeGreaterThanOrEqual(0);
  });

  it('includes total approved CAR amount', () => {
    expect(typeof summary.totalApprovedCARAmount).toBe('number');
    expect(Number.isFinite(summary.totalApprovedCARAmount)).toBe(true);
  });

  it('includes Delivery and Run budget stream rollups', () => {
    expect(Array.isArray(summary.budgetStreamRollups)).toBe(true);
    const streams = summary.budgetStreamRollups.map(r => r.budgetStream);
    expect(streams).toContain('Delivery');
    expect(streams).toContain('Run');
  });

  it('includes project rollups', () => {
    expect(Array.isArray(summary.projectRollups)).toBe(true);
    if (summary.projectRollups.length > 0) {
      expect(summary.projectRollups[0]).toHaveProperty('projectId');
    }
  });

  it('includes CAR rollups', () => {
    expect(Array.isArray(summary.carRollups)).toBe(true);
    if (summary.carRollups.length > 0) {
      expect(summary.carRollups[0]).toHaveProperty('carId');
    }
  });

  it('all numeric totals are finite numbers', () => {
    expect(Number.isFinite(summary.totalCapitalAmount)).toBe(true);
    expect(Number.isFinite(summary.totalExpenseAmount)).toBe(true);
    expect(Number.isFinite(summary.financialLineTotals.actual)).toBe(true);
    expect(Number.isFinite(summary.financialLineTotals.forecast)).toBe(true);
    expect(Number.isFinite(summary.financialLineTotals.variance)).toBe(true);
  });

  it('variance equals actual minus forecast where applicable', () => {
    const { actual, forecast, variance } = summary.financialLineTotals;
    expect(variance).toBeCloseTo(actual - forecast, 5);
  });
});
