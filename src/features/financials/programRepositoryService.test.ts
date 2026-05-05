import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPrograms } from './programRepositoryService';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';

vi.mock('./programFinancialRepositoryFactory');

const mockPrograms = [
  { id: 'p1', name: 'Test Program', description: '', status: 'Active' }
];

const mockRepo = {
  getPrograms: vi.fn().mockResolvedValue(mockPrograms),
  getProjects: vi.fn(),
  getCars: vi.fn(),
  getWorkstreams: vi.fn(),
  getFiscalYears: vi.fn(),
  getFiscalPeriods: vi.fn()
};

describe('programRepositoryService', () => {
  beforeEach(() => {
    (getProgramFinancialRepository as any).mockReturnValue(mockRepo);
  });

  it('returns programs from the repository', async () => {
    const programs = await getPrograms();
    expect(programs).toEqual(mockPrograms);
    expect(mockRepo.getPrograms).toHaveBeenCalled();
  });

  it('uses mock repository by default', async () => {
    await getPrograms();
    expect(getProgramFinancialRepository).toHaveBeenCalled();
  });
});
