import { FinancialLineFilters, FinancialLineInput } from './types';

export interface FinancialLineRepository {
  getFinancialLines(filters?: FinancialLineFilters): Promise<any[]>;
  getFinancialLineById(lineId: string): Promise<any | null>;
  createFinancialLine(input: FinancialLineInput): Promise<any>;
  updateFinancialLine(lineId: string, input: FinancialLineInput): Promise<any>;
}
