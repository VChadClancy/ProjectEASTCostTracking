import { describe, it, expect } from 'vitest';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';

// Only run this test if RUN_API_MODE_SMOKE_TESTS is set to 'true'
const shouldRun = import.meta.env.RUN_API_MODE_SMOKE_TESTS === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

describe.skipIf(!shouldRun)('API Mode Financials Smoke Test', () => {
  it('should fetch programs from the API repository', async () => {
    const repo = getProgramFinancialRepository({
      financialDataSource: 'api',
      baseUrl: API_BASE_URL,
    });
    const result = await repo.getPrograms();
    expect(Array.isArray(result)).toBe(true);
    // Optionally, check for at least one item or structure
    // expect(result.length).toBeGreaterThan(0);
  });
});
