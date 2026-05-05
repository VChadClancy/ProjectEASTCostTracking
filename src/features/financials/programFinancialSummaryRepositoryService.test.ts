import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProgramFinancialSummary } from './programFinancialSummaryRepositoryService';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';

vi.mock('./programFinancialRepositoryFactory');

const mockSummary = { program: { id: 'p1', name: 'Test Program' }, projectCount: 1, carCount: 1, workstreamCount: 1 };

const mockRepo = {
  getProgramFinancialSummary: vi.fn().mockResolvedValue(mockSummary)
};

describe('programFinancialSummaryRepositoryService', () => {
  beforeEach(() => {
    (getProgramFinancialRepository as any).mockReturnValue(mockRepo);
  });

  it('returns program financial summary from the repository', async () => {
    const summary = await getProgramFinancialSummary('p1');
    expect(summary).toEqual(mockSummary);
    expect(mockRepo.getProgramFinancialSummary).toHaveBeenCalledWith('p1');
  });

  it('uses mock repository by default', async () => {
    await getProgramFinancialSummary('p1');
    expect(getProgramFinancialRepository).toHaveBeenCalled();
  });
});
