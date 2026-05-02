import { FinancialLineRepository } from './financialLineRepository';
import { NotImplementedError } from './prismaRepositoryUtils';
import { FinancialLineFilters, FinancialLineInput } from './types';

export class PrismaFinancialLineRepository implements FinancialLineRepository {
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
