// Service for Financial Lines: uses repository interface
import { FinancialLineFilters, FinancialLineInput } from '../repositories/types';
import { getFinancialLineRepository } from '../repositories/repositoryFactory';

export async function getFinancialLines(filters: FinancialLineFilters = {}) {
  const repo = getFinancialLineRepository();
  return repo.getFinancialLines(filters);
}

export async function getFinancialLineById(lineId: string) {
  const repo = getFinancialLineRepository();
  return repo.getFinancialLineById(lineId);
}

export async function createFinancialLine(input: FinancialLineInput) {
  const repo = getFinancialLineRepository();
  return repo.createFinancialLine(input);
}

export async function updateFinancialLine(lineId: string, input: FinancialLineInput) {
  const repo = getFinancialLineRepository();
  return repo.updateFinancialLine(lineId, input);
}
