import { beforeEach, afterEach, vi, describe, it, expect } from 'vitest';
import { ApiProgramFinancialRepository } from './apiProgramFinancialRepository';
import type { ProgramFinancialRepository, Program } from './programFinancialRepository';

const baseUrl = 'https://api.example.com';
let repo: ApiProgramFinancialRepository;

beforeEach(() => {
  repo = new ApiProgramFinancialRepository(baseUrl);
  globalThis.fetch = vi.fn();
});
afterEach(() => {
  vi.resetAllMocks();
});

describe('ApiProgramFinancialRepository', () => {
  it('can be constructed with a baseUrl', () => {
    expect(repo).toBeInstanceOf(ApiProgramFinancialRepository);
    expect((repo as any).baseUrl).toBe(baseUrl);
  });

  it('implements ProgramFinancialRepository', () => {
    const _typed: ProgramFinancialRepository = repo;
    expect(_typed).toBeDefined();
  });

  it('getPrograms: successful backend envelope', async () => {
    const programs: Program[] = [{
      id: 'p1',
      name: 'Test',
      status: 'Active',
      createdBy: 'tester',
      createdAt: '2023-01-01T00:00:00Z',
    }];
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: programs }),
    });
    const result = await repo.getPrograms();
    expect(result).toEqual(programs);
  });

  it('getPrograms: non-2xx response throws error', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
      json: async () => { throw new Error('Should not call json'); },
    });
    await expect(repo.getPrograms()).rejects.toThrow(/HTTP 500/);
  });

  it('getPrograms: success false in envelope throws error', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, message: 'Backend error' }),
    });
    await expect(repo.getPrograms()).rejects.toThrow(/Backend error/);
  });

  it('getPrograms: envelope missing data throws error', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    await expect(repo.getPrograms()).rejects.toThrow(/missing data/);
  });

  it('getPrograms: malformed JSON throws error', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => { throw new Error('bad json'); },
    });
    await expect(repo.getPrograms()).rejects.toThrow(/Malformed JSON/);
  });

  it('getPrograms: malformed envelope throws error', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => null,
    });
    await expect(repo.getPrograms()).rejects.toThrow(/Malformed API envelope/);
  });

  it('getPrograms: supports custom baseUrl', async () => {
    const customUrl = 'https://custom.example.com';
    const customRepo = new ApiProgramFinancialRepository(customUrl);
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    await customRepo.getPrograms();
    expect((globalThis.fetch as any).mock.calls[0][0]).toContain(customUrl);
  });

  const notImpl = 'API repository is not implemented yet.';
  it('getProjects throws not implemented', async () => {
    await expect(repo.getProjects()).rejects.toThrow(notImpl);
  });
  it('getCars throws not implemented', async () => {
    await expect(repo.getCars()).rejects.toThrow(notImpl);
  });
  it('getWorkstreams throws not implemented', async () => {
    await expect(repo.getWorkstreams()).rejects.toThrow(notImpl);
  });
  it('getFiscalYears throws not implemented', async () => {
    await expect(repo.getFiscalYears()).rejects.toThrow(notImpl);
  });
  it('getFiscalPeriods throws not implemented', async () => {
    await expect(repo.getFiscalPeriods()).rejects.toThrow(notImpl);
  });
  it('getFinancialLines throws not implemented', async () => {
    await expect(repo.getFinancialLines()).rejects.toThrow(notImpl);
  });
  it('getProgramFinancialSummary throws not implemented', async () => {
    await expect(repo.getProgramFinancialSummary('program-1')).rejects.toThrow(notImpl);
  });
});
