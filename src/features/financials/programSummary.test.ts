import { describe, it, expect } from 'vitest';
import { createProgramSummary } from './programSummary';

// These tests assume the mock data in programService is not empty and is consistent

describe('createProgramSummary', () => {
  const summary = createProgramSummary();

  it('returns correct counts', () => {
    expect(summary.programCount).toBeGreaterThan(0);
    expect(summary.projectCount).toBeGreaterThan(0);
    expect(summary.carCount).toBeGreaterThan(0);
    expect(summary.workstreamCount).toBeGreaterThan(0);
  });

  it('total approved CAR amount equals capital plus expense totals', () => {
    expect(summary.totalApprovedCarAmount).toBeCloseTo(
      summary.totalCapitalAmount + summary.totalExpenseAmount,
      2
    );
  });

  it('totals are finite numbers', () => {
    expect(Number.isFinite(summary.totalApprovedCarAmount)).toBe(true);
    expect(Number.isFinite(summary.totalCapitalAmount)).toBe(true);
    expect(Number.isFinite(summary.totalExpenseAmount)).toBe(true);
  });
});
