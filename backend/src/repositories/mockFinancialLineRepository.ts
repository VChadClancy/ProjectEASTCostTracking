// Mock implementation of FinancialLineRepository
import { FinancialLineRepository } from './financialLineRepository';
import { FinancialLineFilters, FinancialLineInput } from './types';
import { financialLines } from '../data/mockFinancialLineData';

function isFiniteNumber(n: any): boolean {
  return typeof n === 'number' && isFinite(n);
}

function withVariance(line: any) {
  const actualAmount = isFiniteNumber(line.actualAmount) ? line.actualAmount : 0;
  const forecastAmount = isFiniteNumber(line.forecastAmount) ? line.forecastAmount : 0;
  return {
    ...line,
    actualAmount,
    forecastAmount,
    varianceAmount: actualAmount - forecastAmount,
  };
}

function normalizeFinancialLine(line: any): any {
  const actualAmount = typeof line.actualAmount === 'number' && isFinite(line.actualAmount) ? line.actualAmount : 0;
  const forecastAmount = typeof line.forecastAmount === 'number' && isFinite(line.forecastAmount) ? line.forecastAmount : 0;
  return {
    ...line,
    actualAmount,
    forecastAmount,
    varianceAmount: actualAmount - forecastAmount,
  };
}

export class MockFinancialLineRepository implements FinancialLineRepository {
  private data = [...financialLines];

  async getFinancialLines(filters: FinancialLineFilters = {}): Promise<any[]> {
    let lines = this.data;
    if (filters.programId) lines = lines.filter(l => l.programId === filters.programId);
    if (filters.projectId) lines = lines.filter(l => l.projectId === filters.projectId);
    if (filters.carId) lines = lines.filter(l => l.carId === filters.carId);
    if (filters.workstreamId) lines = lines.filter(l => l.workstreamId === filters.workstreamId);
    if (filters.fiscalYearId) lines = lines.filter(l => l.fiscalYearId === filters.fiscalYearId);
    if (filters.fiscalPeriodId) lines = lines.filter(l => l.fiscalPeriodId === filters.fiscalPeriodId);
    if (filters.budgetStream) lines = lines.filter(l => l.budgetStream === filters.budgetStream);
    if (filters.limit !== undefined) {
      lines = lines.slice(filters.offset || 0, (filters.offset || 0) + filters.limit);
    }
    return lines.map(normalizeFinancialLine);
  }

  async getFinancialLineById(lineId: string): Promise<any | null> {
    const l = this.data.find(l => l.id === lineId);
    return l ? normalizeFinancialLine(l) : null;
  }

  async createFinancialLine(input: FinancialLineInput): Promise<any> {
    const actualAmount = typeof input.amount === 'number' && isFinite(input.amount) ? input.amount : 0;
    const forecastAmount = 0;
    const newLine: any = {
      id: (Math.random() * 1e9).toFixed(0),
      ...input,
      actualAmount,
      forecastAmount,
      varianceAmount: actualAmount - forecastAmount,
    };
    this.data.push(newLine);
    return normalizeFinancialLine(newLine);
  }

  async updateFinancialLine(lineId: string, input: Partial<FinancialLineInput>): Promise<any | null> {
    const idx = this.data.findIndex(l => l.id === lineId);
    if (idx === -1) return null;
    const oldLine = this.data[idx];
    // Merge input values, defaulting to old values if not provided
    const actualAmount = typeof input.amount === 'number' && isFinite(input.amount) ? input.amount : oldLine.actualAmount;
    // If input.forecastAmount is provided, update it, else use old value
    const forecastAmount = typeof (input as any).forecastAmount === 'number' && isFinite((input as any).forecastAmount)
      ? (input as any).forecastAmount
      : oldLine.forecastAmount;
    const updatedLine = {
      ...oldLine,
      ...input,
      actualAmount,
      forecastAmount,
      varianceAmount: actualAmount - forecastAmount,
    };
    this.data[idx] = updatedLine;
    return normalizeFinancialLine(updatedLine);
  }
}

export const mockFinancialLineRepository = new MockFinancialLineRepository();
