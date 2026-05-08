// Tests for Forecast Version Service (Sprint 13)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as factory from './forecastVersionRepositoryFactory';
import * as service from './forecastVersionService';
import { mockForecastVersionRepository } from './mockForecastVersionRepository';

// Helper: stub factory to always return mock
beforeEach(() => {
  vi.spyOn(factory, 'getForecastVersionRepository').mockReturnValue(mockForecastVersionRepository);
});

describe('forecastVersionService', () => {
  it('returns forecast versions', async () => {
    const result = await service.getForecastVersions();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('retrieves by id', async () => {
    const all = await service.getForecastVersions();
    const one = await service.getForecastVersionById(all[0].id);
    expect(one).toBeDefined();
    expect(one?.id).toBe(all[0].id);
  });

  it('retrieves by programId', async () => {
    const all = await service.getForecastVersions();
    const { programId } = all[0];
    const filtered = await service.getForecastVersionsByProgramId(programId);
    expect(filtered.every(v => v.programId === programId)).toBe(true);
  });

  it('retrieves by projectId', async () => {
    const all = await service.getForecastVersions();
    const { projectId } = all[0].snapshotLines[0];
    if (!projectId) throw new Error('Expected projectId');
    const filtered = await service.getForecastVersionsByProjectId(projectId);
    expect(filtered.some(v => v.snapshotLines.some(l => l.projectId === projectId))).toBe(true);
  });

  it('saves a forecast version', async () => {
    const all = await service.getForecastVersions();
    const input = { ...all[0], id: 'new-id', name: 'New Version' };
    const saved = await service.saveForecastVersion(input);
    expect(saved).toMatchObject(input);
  });

  it('compares two forecast versions', async () => {
    const all = await service.getForecastVersions();
    const base = all[0];
    const compare = all[1];
    const result = await service.compareForecastVersions(base.id, compare.id);
    expect(result).toBeDefined();
    expect(Array.isArray(result?.deltas)).toBe(true);
    expect(result?.summary).toBeDefined();
  });

  it('does not perform network/fetch in mock mode', async () => {
    // No fetch should be called in mock
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await service.getForecastVersions();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('API mode throws clear error if not implemented', async () => {
    vi.spyOn(factory, 'getForecastVersionRepository').mockImplementation(() => { throw new Error('API ForecastVersionRepository not implemented.'); });
    await expect(service.getForecastVersions()).rejects.toThrow(/not implemented/i);
  });
});
