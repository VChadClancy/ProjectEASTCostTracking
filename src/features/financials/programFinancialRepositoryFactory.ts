import { appConfig } from '../../config/appConfig';
import { ApiProgramFinancialRepository } from './apiProgramFinancialRepository';
import { mockProgramFinancialRepository } from './mockProgramFinancialRepository';
import type { ProgramFinancialRepository } from './programFinancialRepository';

/**
 * Returns a ProgramFinancialRepository implementation based on appConfig.financialDataSource.
 * Allows optional override for config/env and dependency injection for tests.
 */
export function getProgramFinancialRepository(
  opts?: { financialDataSource?: string; baseUrl?: string; mockRepo?: ProgramFinancialRepository; apiRepo?: ProgramFinancialRepository }
): ProgramFinancialRepository {
  const source = opts?.financialDataSource ?? appConfig.financialDataSource;
  if (source === 'api') {
    if (opts?.apiRepo) return opts.apiRepo;
    return new ApiProgramFinancialRepository(opts?.baseUrl);
  }
  // fallback to mock
  if (opts?.mockRepo) return opts.mockRepo;
  return mockProgramFinancialRepository;
}
