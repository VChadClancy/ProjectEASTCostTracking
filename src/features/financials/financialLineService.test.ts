import { describe, it, expect } from 'vitest';
import { getFinancialLines } from './financialLineService';
import { getProjects, getCars } from './programService';

describe('FinancialLine model and service', () => {
  const lines = getFinancialLines();
  const projects = getProjects();
  const cars = getCars();

  it('every financial line has a programId', () => {
    for (const line of lines) {
      expect(line.programId).toBeTruthy();
    }
  });

  it('projectId and carId values, when present, match existing mock projects/CARs', () => {
    const projectIds = new Set(projects.map(p => p.id));
    const carIds = new Set(cars.map(c => c.id));
    for (const line of lines) {
      if (line.projectId) expect(projectIds.has(line.projectId)).toBe(true);
      if (line.carId) expect(carIds.has(line.carId)).toBe(true);
    }
  });

  it('varianceAmount equals actualAmount minus forecastAmount', () => {
    for (const line of lines) {
      expect(line.varianceAmount).toBe(line.actualAmount - line.forecastAmount);
    }
  });

  it('Run budget stream lines may omit projectId/carId', () => {
    for (const line of lines) {
      if (line.budgetStream === 'Run') {
        expect(line.projectId).toBeUndefined();
        expect(line.carId).toBeUndefined();
      }
    }
  });

  it('Delivery budget stream lines should include at least projectId or carId', () => {
    for (const line of lines) {
      if (line.budgetStream === 'Delivery') {
        expect(line.projectId || line.carId).toBeTruthy();
      }
    }
  });
});
