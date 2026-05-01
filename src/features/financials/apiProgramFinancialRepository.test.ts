import { describe, it, expect } from 'vitest';
import { ApiProgramFinancialRepository } from './apiProgramFinancialRepository';
import type { ProgramFinancialRepository } from './programFinancialRepository';

describe('ApiProgramFinancialRepository', () => {
  const baseUrl = 'https://api.example.com';
  const repo = new ApiProgramFinancialRepository(baseUrl);

  it('can be constructed with a baseUrl', () => {
    expect(repo).toBeInstanceOf(ApiProgramFinancialRepository);
    expect((repo as any).baseUrl).toBe(baseUrl);
  });

  it('implements ProgramFinancialRepository', () => {
    // Type check only; will fail to compile if not implemented
    const _typed: ProgramFinancialRepository = repo;
    expect(_typed).toBeDefined();
  });

  const notImpl = 'API repository is not implemented yet.';

  it('getPrograms throws not implemented', async () => {
    await expect(repo.getPrograms()).rejects.toThrow(notImpl);
  });
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
