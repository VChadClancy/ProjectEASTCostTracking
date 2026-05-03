import { FinancialLineRepository } from './financialLineRepository';
import { NotImplementedError } from './prismaRepositoryUtils';
import { FinancialLineFilters, FinancialLineInput } from './types';
import { getPrismaClient } from '../db/prismaClient';
import type { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

function toNumber(val: any) {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return Number(val);
  if (val instanceof Decimal) return val.toNumber();
  if (typeof val === 'object' && typeof val.toNumber === 'function') return val.toNumber();
  return Number(val) || 0;
}

function mapFinancialLine(line: any) {
  const actualAmount = toNumber(line.actualAmount);
  const forecastAmount = toNumber(line.forecastAmount);
  let varianceAmount = line.varianceAmount != null ? toNumber(line.varianceAmount) : actualAmount - forecastAmount;
  return {
    ...line,
    actualAmount,
    forecastAmount,
    varianceAmount,
    amount: toNumber(line.amount),
  };
}

export class PrismaFinancialLineRepository implements FinancialLineRepository {
  private _prisma?: PrismaClient;
  constructor(prisma?: PrismaClient) {
    if (prisma) this._prisma = prisma;
  }

  private getClient(): PrismaClient {
    if (this._prisma) return this._prisma;
    return getPrismaClient();
  }

  async getFinancialLines(filters: FinancialLineFilters = {}): Promise<any[]> {
    const prisma = this.getClient();
    const where: any = {};
    if (filters.programId) where.programId = filters.programId;
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.carId) where.carId = filters.carId;
    if (filters.workstreamId) where.workstreamId = filters.workstreamId;
    if (filters.fiscalYearId) where.fiscalYearId = filters.fiscalYearId;
    if (filters.fiscalPeriodId) where.fiscalPeriodId = filters.fiscalPeriodId;
    if (filters.budgetStream) {
      where.budgetStream = { name: filters.budgetStream };
    }
    const lines = await prisma.financialLine.findMany({
      where,
      include: filters.budgetStream ? { budgetStream: true } : undefined,
      skip: filters.offset,
      take: filters.limit,
    });
    return lines.map(mapFinancialLine);
  }

  async getFinancialLineById(lineId: string): Promise<any | null> {
    const prisma = this.getClient();
    const line = await prisma.financialLine.findUnique({ where: { id: lineId } });
    return line ? mapFinancialLine(line) : null;
  }

  async createFinancialLine(input: FinancialLineInput): Promise<any> {
    throw new NotImplementedError();
  }
  async updateFinancialLine(lineId: string, input: FinancialLineInput): Promise<any> {
    throw new NotImplementedError();
  }
}
