// Service for Financial Lines: uses repository interface
import { FinancialLineRepository, mockFinancialLineRepository } from '../repositories';
import { FinancialLineFilters, FinancialLineInput } from '../repositories/types';

const repo: FinancialLineRepository = mockFinancialLineRepository;

export async function getFinancialLines(filters: FinancialLineFilters = {}) {
  return repo.getFinancialLines(filters);
}

export async function getFinancialLineById(lineId: string) {
  return repo.getFinancialLineById(lineId);
}

export async function createFinancialLine(input: FinancialLineInput) {
  return repo.createFinancialLine(input);
}

export async function updateFinancialLine(lineId: string, input: FinancialLineInput) {
  return repo.updateFinancialLine(lineId, input);
}
