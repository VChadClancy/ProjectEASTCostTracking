// Service for Financial Lines: provides access to mock data for financial lines
import { financialLines } from '../data/mockFinancialLineData';

export interface FinancialLine {
  id: string;
  programId: string;
  projectId: string;
  carId: string;
  workstreamId: string;
  fiscalYearId: string;
  fiscalPeriodId: string;
  budgetStream: string;
  name: string;
  amount: number;
  actualAmount: number;
  forecastAmount: number;
  fiscalYear: string;
  [key: string]: any;
}

export interface FinancialLineFilters {
  programId?: string;
  projectId?: string;
  carId?: string;
  workstreamId?: string;
  fiscalYearId?: string;
  fiscalPeriodId?: string;
  budgetStream?: string;
}

function isFiniteNumber(n: any): boolean {
  return typeof n === 'number' && isFinite(n);
}

function computeVariance(actual: number, forecast: number): number {
  if (!isFiniteNumber(actual)) actual = 0;
  if (!isFiniteNumber(forecast)) forecast = 0;
  return actual - forecast;
}

export function getFinancialLines(filters: FinancialLineFilters = {}): FinancialLine[] {
  let results = financialLines as FinancialLine[];
  if (filters.programId) results = results.filter(l => l.programId === filters.programId);
  if (filters.projectId) results = results.filter(l => l.projectId === filters.projectId);
  if (filters.carId) results = results.filter(l => l.carId === filters.carId);
  if (filters.workstreamId) results = results.filter(l => l.workstreamId === filters.workstreamId);
  if (filters.fiscalYearId) results = results.filter(l => l.fiscalYearId === filters.fiscalYearId);
  if (filters.fiscalPeriodId) results = results.filter(l => l.fiscalPeriodId === filters.fiscalPeriodId);
  if (filters.budgetStream) results = results.filter(l => l.budgetStream === filters.budgetStream);

  return results.map(l => ({
    ...l,
    actualAmount: isFiniteNumber(l.actualAmount) ? l.actualAmount : 0,
    forecastAmount: isFiniteNumber(l.forecastAmount) ? l.forecastAmount : 0,
    varianceAmount: computeVariance(l.actualAmount, l.forecastAmount)
  }));
}

export function getFinancialLineById(lineId: string): FinancialLine | null {
  const l = (financialLines as FinancialLine[]).find(l => l.id === lineId);
  if (!l) return null;
  return {
    ...l,
    actualAmount: isFiniteNumber(l.actualAmount) ? l.actualAmount : 0,
    forecastAmount: isFiniteNumber(l.forecastAmount) ? l.forecastAmount : 0,
    varianceAmount: computeVariance(l.actualAmount, l.forecastAmount)
  };
}

export function createFinancialLine(input: Partial<FinancialLine>): FinancialLine {
  // Compose a new line-like object (no persistence)
  const actualAmount = isFiniteNumber(input.actualAmount) ? input.actualAmount! : 0;
  const forecastAmount = isFiniteNumber(input.forecastAmount) ? input.forecastAmount! : 0;
  return {
    ...input,
    id: 'mock-' + Math.random().toString(36).slice(2, 10),
    actualAmount,
    forecastAmount,
    varianceAmount: computeVariance(actualAmount, forecastAmount)
  } as FinancialLine;
}

export function updateFinancialLine(lineId: string, input: Partial<FinancialLine>): FinancialLine | null {
  // Find the line, return updated object (no persistence)
  const orig = (financialLines as FinancialLine[]).find(l => l.id === lineId);
  if (!orig) return null;
  const actualAmount = isFiniteNumber(input.actualAmount) ? input.actualAmount! : orig.actualAmount;
  const forecastAmount = isFiniteNumber(input.forecastAmount) ? input.forecastAmount! : orig.forecastAmount;
  return {
    ...orig,
    ...input,
    actualAmount,
    forecastAmount,
    varianceAmount: computeVariance(actualAmount, forecastAmount)
  };
}
