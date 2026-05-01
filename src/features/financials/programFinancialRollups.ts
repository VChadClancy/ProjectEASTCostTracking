import { FinancialLine } from './financialLineTypes';

export interface FinancialRollup {
  id: string;
  forecastAmount: number;
  actualAmount: number;
  varianceAmount: number;
  lineCount: number;
}

function rollup(lines: FinancialLine[], getId: (line: FinancialLine) => string | undefined): FinancialRollup[] {
  const map = new Map<string, FinancialRollup>();
  for (const line of lines) {
    const id = getId(line);
    if (!id) continue;
    if (!map.has(id)) {
      map.set(id, {
        id,
        forecastAmount: 0,
        actualAmount: 0,
        varianceAmount: 0,
        lineCount: 0,
      });
    }
    const rollup = map.get(id)!;
    rollup.forecastAmount += line.forecastAmount;
    rollup.actualAmount += line.actualAmount;
    rollup.lineCount++;
  }
  for (const rollup of map.values()) {
    rollup.varianceAmount = rollup.actualAmount - rollup.forecastAmount;
  }
  return Array.from(map.values());
}

export function rollupFinancialLinesByProgram(lines: FinancialLine[]): FinancialRollup[] {
  return rollup(lines, l => l.programId);
}

export function rollupFinancialLinesByProject(lines: FinancialLine[]): FinancialRollup[] {
  return rollup(lines.filter(l => l.projectId), l => l.projectId);
}

export function rollupFinancialLinesByCar(lines: FinancialLine[]): FinancialRollup[] {
  return rollup(lines.filter(l => l.carId), l => l.carId);
}

export function rollupFinancialLinesByWorkstream(lines: FinancialLine[]): FinancialRollup[] {
  return rollup(lines.filter(l => l.workstreamId), l => l.workstreamId);
}

export function rollupFinancialLinesByBudgetStream(lines: FinancialLine[]): FinancialRollup[] {
  return rollup(lines, l => l.budgetStream);
}
