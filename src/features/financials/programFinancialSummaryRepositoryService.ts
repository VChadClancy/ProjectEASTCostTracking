import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';
import type { ProgramFinancialSummary } from './programFinancialRepository';

export async function getProgramFinancialSummary(programId: string): Promise<ProgramFinancialSummary> {
  return getProgramFinancialRepository().getProgramFinancialSummary(programId);
}
