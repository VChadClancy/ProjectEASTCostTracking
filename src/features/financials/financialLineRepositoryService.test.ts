import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFinancialLines } from './financialLineRepositoryService';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';

vi.mock('./programFinancialRepositoryFactory');

const mockLines = [
  { id: 'fl1', programId: 'p1', forecastAmount: 100, actualAmount: 90, varianceAmount: -10 }
];

const mockRepo = {
  getFinancialLines: vi.fn().mockResolvedValue(mockLines)
};

describe('financialLineRepositoryService', () => {
  beforeEach(() => {
    (getProgramFinancialRepository as any).mockReturnValue(mockRepo);
  });

  it('returns financial lines from the repository', async () => {
    const lines = await getFinancialLines();
    expect(lines).toEqual(mockLines);
    expect(mockRepo.getFinancialLines).toHaveBeenCalled();
  });

  it('uses mock repository by default', async () => {
    await getFinancialLines();
    expect(getProgramFinancialRepository).toHaveBeenCalled();
  });
});
