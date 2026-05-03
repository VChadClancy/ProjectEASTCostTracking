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
    const {
      programId,
      projectId,
      carId,
      workstreamId,
      fiscalYearId,
      fiscalPeriodId,
      budgetStreamId,
      costCategoryId,
      amount,
      actualAmount,
      forecastAmount,
      status,
      createdBy,
      updatedBy,
      sourceSystem,
      createdAt,
      updatedAt,
      // Remove unsupported fields
      name, // do not pass to Prisma
      description, // do not pass to Prisma
      ...rest
    } = input;
    if (!programId || !projectId || !carId || !workstreamId || !fiscalYearId || !fiscalPeriodId || !budgetStreamId || !costCategoryId) {
      throw new Error('Missing required field(s) for FinancialLine');
    }
    const Decimal = (await import('decimal.js')).default;
    const amountDec = new Decimal(amount);
    const actualAmountDec = actualAmount != null ? new Decimal(actualAmount) : new Decimal(0);
    const forecastAmountDec = forecastAmount != null ? new Decimal(forecastAmount) : new Decimal(0);
    const varianceAmountDec = actualAmountDec.minus(forecastAmountDec);
    const created = await prisma.financialLine.create({
      data: {
        program: { connect: { id: programId } },
        project: { connect: { id: projectId } },
        car: { connect: { id: carId } },
        workstream: { connect: { id: workstreamId } },
        fiscalYear: { connect: { id: fiscalYearId } },
        fiscalPeriod: { connect: { id: fiscalPeriodId } },
        budgetStream: { connect: { id: budgetStreamId } },
        costCategory: { connect: { id: costCategoryId } },
        amount: amountDec,
        actualAmount: actualAmountDec,
        forecastAmount: forecastAmountDec,
        varianceAmount: varianceAmountDec,
        status,
        createdBy,
        updatedBy,
        sourceSystem,
        createdAt,
        updatedAt,
        // Do not spread ...rest
      },
    });
    return mapFinancialLine(created);
  }

  async updateFinancialLine(lineId: string, input: any): Promise<any | null> {
    const prisma = this.getClient();
    const existing = await prisma.financialLine.findUnique({ where: { id: lineId } });
    if (!existing) return null;
    const Decimal = (await import('decimal.js')).default;
    const updateData: Record<string, unknown> = {};

    if (input.amount !== undefined) {
      updateData.amount = new Decimal(input.amount);
    }

    const resolvedActualAmount =
      input.actualAmount !== undefined
        ? new Decimal(input.actualAmount)
        : new Decimal(existing.actualAmount?.toString() ?? '0');

    const resolvedForecastAmount =
      input.forecastAmount !== undefined
        ? new Decimal(input.forecastAmount)
        : new Decimal(existing.forecastAmount?.toString() ?? '0');

    if (input.actualAmount !== undefined) {
      updateData.actualAmount = resolvedActualAmount;
    }

    if (input.forecastAmount !== undefined) {
      updateData.forecastAmount = resolvedForecastAmount;
    }

    if (input.actualAmount !== undefined || input.forecastAmount !== undefined) {
      updateData.varianceAmount = resolvedActualAmount.minus(resolvedForecastAmount);
    }

    if (input.status !== undefined) {
      updateData.status = input.status;
    }
    if (input.createdBy !== undefined) {
      updateData.createdBy = input.createdBy;
    }
    if (input.updatedBy !== undefined) {
      updateData.updatedBy = input.updatedBy;
    }
    if (input.sourceSystem !== undefined) {
      updateData.sourceSystem = input.sourceSystem;
    }
    if (input.createdAt !== undefined) {
      updateData.createdAt = input.createdAt;
    }
    if (input.updatedAt !== undefined) {
      updateData.updatedAt = input.updatedAt;
    }

    const updated = await prisma.financialLine.update({
      where: { id: lineId },
      data: updateData,
    });
    return mapFinancialLine(updated);
  }
}
