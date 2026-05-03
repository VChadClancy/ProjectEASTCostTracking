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

  async createFinancialLine(input: any): Promise<any> {
    const prisma = this.getClient();
    // Required fields: programId, projectId, carId, workstreamId, fiscalPeriodId, amount, actualAmount, forecastAmount, budgetStreamId, fiscalYearId
    // Accept input as FinancialLineInput, but allow extra fields for test flexibility
    const {
      programId,
      projectId,
      carId,
      workstreamId,
      fiscalYearId,
      fiscalPeriodId,
      budgetStreamId,
      amount,
      actualAmount,
      forecastAmount,
      ...rest
    } = input;
    if (!programId || !projectId || !carId || !workstreamId || !fiscalYearId || !fiscalPeriodId || !budgetStreamId) {
      throw new Error('Missing required field(s) for FinancialLine');
    }
    // Prisma Decimal conversion
    const Decimal = (await import('decimal.js')).default;
    const amountDec = new Decimal(amount);
    const actualAmountDec = actualAmount != null ? new Decimal(actualAmount) : new Decimal(0);
    const forecastAmountDec = forecastAmount != null ? new Decimal(forecastAmount) : new Decimal(0);
    const varianceAmountDec = actualAmountDec.minus(forecastAmountDec);
    const created = await prisma.financialLine.create({
      data: {
        programId,
        projectId,
        carId,
        workstreamId,
        fiscalYearId,
        fiscalPeriodId,
        budgetStreamId,
        amount: amountDec,
        actualAmount: actualAmountDec,
        forecastAmount: forecastAmountDec,
        varianceAmount: varianceAmountDec,
        ...rest,
      },
    });
    return mapFinancialLine(created);
  }

  async updateFinancialLine(lineId: string, input: any): Promise<any | null> {
    const prisma = this.getClient();
    // Find existing
    const existing = await prisma.financialLine.findUnique({ where: { id: lineId } });
    if (!existing) return null;
    // Prepare update
    const Decimal = (await import('decimal.js')).default;
    let updateData: any = { ...input };
    // If actualAmount or forecastAmount is being updated, recalc varianceAmount
    let actual = input.actualAmount != null ? new Decimal(input.actualAmount) : new Decimal(existing.actualAmount ?? 0);
    let forecast = input.forecastAmount != null ? new Decimal(input.forecastAmount) : new Decimal(existing.forecastAmount ?? 0);
    if ('actualAmount' in input || 'forecastAmount' in input) {
      updateData.varianceAmount = actual.minus(forecast);
    }
    if ('amount' in input) updateData.amount = new Decimal(input.amount);
    if ('actualAmount' in input) updateData.actualAmount = actual;
    if ('forecastAmount' in input) updateData.forecastAmount = forecast;
    const updated = await prisma.financialLine.update({
      where: { id: lineId },
      data: updateData,
    });
    return mapFinancialLine(updated);
  }
}
