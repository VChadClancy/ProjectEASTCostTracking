import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPrograms } from './programRepositoryService';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';

vi.mock('./programFinancialRepositoryFactory');

describe('programRepositoryService integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('does not call fetch in mock mode', async () => {
    globalThis.fetch = vi.fn();
    (getProgramFinancialRepository as any).mockReturnValue({
      getPrograms: vi.fn().mockResolvedValue([])
    });
    await getPrograms();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('calls fetch in API mode', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    });
    globalThis.fetch = fetchMock;
    // Simulate API repo
    const { ApiProgramFinancialRepository } = await import('./apiProgramFinancialRepository');
    (getProgramFinancialRepository as any).mockReturnValue(new ApiProgramFinancialRepository('http://test'));
    await getPrograms();
    expect(fetchMock).toHaveBeenCalled();
  });
});
