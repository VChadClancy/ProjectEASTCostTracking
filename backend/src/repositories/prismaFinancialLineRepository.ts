import { FinancialLineRepository } from './financialLineRepository';
import { NotImplementedError } from './prismaRepositoryUtils';
import { FinancialLineFilters, FinancialLineInput } from './types';
import { getPrismaClient } from '../db/prismaClient';
import type { PrismaClient } from '@prisma/client';

export class PrismaFinancialLineRepository implements FinancialLineRepository {
  private prisma: PrismaClient;
  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? undefined as any;
    // Do not call getPrismaClient unless needed in future
  }
  async getFinancialLines(filters?: FinancialLineFilters): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getFinancialLineById(lineId: string): Promise<any | null> {
    throw new NotImplementedError();
  }
  async createFinancialLine(input: FinancialLineInput): Promise<any> {
    throw new NotImplementedError();
  }
  async updateFinancialLine(lineId: string, input: FinancialLineInput): Promise<any> {
    throw new NotImplementedError();
  }
}
