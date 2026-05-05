import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';
import type { FinancialLine, FinancialLineFilters } from './programFinancialRepository';

export async function getFinancialLines(filters?: FinancialLineFilters): Promise<FinancialLine[]> {
  return getProgramFinancialRepository().getFinancialLines(filters);
}
