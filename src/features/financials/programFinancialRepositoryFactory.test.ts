import { describe, it, expect, vi } from 'vitest';
import { getProgramFinancialRepository } from './programFinancialRepositoryFactory';
import { ApiProgramFinancialRepository } from './apiProgramFinancialRepository';
import { mockProgramFinancialRepository } from './mockProgramFinancialRepository';
import type { ProgramFinancialRepository } from './programFinancialRepository';

// Helper to patch appConfig for test
vi.mock('../../config/appConfig', () => {
  return {
    appConfig: {
      financialDataSource: 'mock',
      apiBaseUrl: 'http://api',
    },
  };
});

describe('getProgramFinancialRepository', () => {
  it('returns mock repository by default', () => {
    const repo = getProgramFinancialRepository();
    expect(repo).toBe(mockProgramFinancialRepository);
  });

  it('returns mock repository for mock config', () => {
    const repo = getProgramFinancialRepository({ financialDataSource: 'mock' });
    expect(repo).toBe(mockProgramFinancialRepository);
  });

  it('returns API repository for api config', () => {
    const repo = getProgramFinancialRepository({ financialDataSource: 'api' });
    expect(repo).toBeInstanceOf(ApiProgramFinancialRepository);
  });

  it('returns mock repository for invalid config', () => {
    const repo = getProgramFinancialRepository({ financialDataSource: 'invalid' });
    expect(repo).toBe(mockProgramFinancialRepository);
  });

  it('allows dependency injection for mockRepo', () => {
    const fake: ProgramFinancialRepository = { getPrograms: async () => [], getProjects: async () => [], getCars: async () => [], getWorkstreams: async () => [], getFiscalYears: async () => [], getFiscalPeriods: async () => [], getFinancialLines: async () => [], getProgramFinancialSummary: async () => ({ programId: '' }) };
    const repo = getProgramFinancialRepository({ mockRepo: fake });
    expect(repo).toBe(fake);
  });

  it('allows dependency injection for apiRepo', () => {
    const fake: ProgramFinancialRepository = { getPrograms: async () => [], getProjects: async () => [], getCars: async () => [], getWorkstreams: async () => [], getFiscalYears: async () => [], getFiscalPeriods: async () => [], getFinancialLines: async () => [], getProgramFinancialSummary: async () => ({ programId: '' }) };
    const repo = getProgramFinancialRepository({ financialDataSource: 'api', apiRepo: fake });
    expect(repo).toBe(fake);
  });

  it('does not call fetch at import or construction time', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    getProgramFinancialRepository({ financialDataSource: 'api' });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
