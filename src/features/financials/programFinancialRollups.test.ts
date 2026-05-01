import { describe, it, expect } from 'vitest';
import { getFinancialLines } from './financialLineService';
import {
  rollupFinancialLinesByProgram,
  rollupFinancialLinesByProject,
  rollupFinancialLinesByCar,
  rollupFinancialLinesByWorkstream,
  rollupFinancialLinesByBudgetStream,
} from './programFinancialRollups';
import { getPrograms } from './programService';

const lines = getFinancialLines();
const programs = getPrograms();

describe('Program/Project/CAR/Workstream/BudgetStream rollups', () => {
  it('program rollups include the mock program', () => {
    const rollups = rollupFinancialLinesByProgram(lines);
    const programIds = new Set(programs.map(p => p.id));
    for (const rollup of rollups) {
      expect(programIds.has(rollup.id)).toBe(true);
    }
  });

  it('project rollups include only lines with projectId', () => {
    const rollups = rollupFinancialLinesByProject(lines);
    for (const rollup of rollups) {
      expect(rollup.id).toBeTruthy();
    }
    // All rollup IDs should match a projectId in the lines
    const projectIds = new Set(lines.filter(l => l.projectId).map(l => l.projectId));
    for (const rollup of rollups) {
      expect(projectIds.has(rollup.id)).toBe(true);
    }
  });

  it('CAR rollups include only lines with carId', () => {
    const rollups = rollupFinancialLinesByCar(lines);
    const carIds = new Set(lines.filter(l => l.carId).map(l => l.carId));
    for (const rollup of rollups) {
      expect(carIds.has(rollup.id)).toBe(true);
    }
  });

  it('workstream rollups include only lines with workstreamId', () => {
    const rollups = rollupFinancialLinesByWorkstream(lines);
    const workstreamIds = new Set(lines.filter(l => l.workstreamId).map(l => l.workstreamId));
    for (const rollup of rollups) {
      expect(workstreamIds.has(rollup.id)).toBe(true);
    }
  });

  it('budget stream rollups include Delivery and Run', () => {
    const rollups = rollupFinancialLinesByBudgetStream(lines);
    const streams = new Set(lines.map(l => l.budgetStream));
    for (const rollup of rollups) {
      expect(streams.has(rollup.id)).toBe(true);
    }
    expect(streams.has('Run')).toBe(true);
    expect(streams.has('Delivery')).toBe(true);
  });

  it('all rollup variance values equal actual minus forecast', () => {
    const allRollups = [
      ...rollupFinancialLinesByProgram(lines),
      ...rollupFinancialLinesByProject(lines),
      ...rollupFinancialLinesByCar(lines),
      ...rollupFinancialLinesByWorkstream(lines),
      ...rollupFinancialLinesByBudgetStream(lines),
    ];
    for (const rollup of allRollups) {
      expect(rollup.varianceAmount).toBeCloseTo(rollup.actualAmount - rollup.forecastAmount);
    }
  });

  it('all rollup numeric values are finite numbers', () => {
    const allRollups = [
      ...rollupFinancialLinesByProgram(lines),
      ...rollupFinancialLinesByProject(lines),
      ...rollupFinancialLinesByCar(lines),
      ...rollupFinancialLinesByWorkstream(lines),
      ...rollupFinancialLinesByBudgetStream(lines),
    ];
    for (const rollup of allRollups) {
      expect(Number.isFinite(rollup.forecastAmount)).toBe(true);
      expect(Number.isFinite(rollup.actualAmount)).toBe(true);
      expect(Number.isFinite(rollup.varianceAmount)).toBe(true);
      expect(Number.isFinite(rollup.lineCount)).toBe(true);
    }
  });
});
