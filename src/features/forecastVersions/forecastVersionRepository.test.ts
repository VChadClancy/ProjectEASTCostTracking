// Vitest tests for Forecast Version Repository contract and mock implementation
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockForecastVersionRepository } from './mockForecastVersionRepository';
import { ForecastVersion, ForecastVersionKind, ForecastVersionStatus, ForecastVersionScope } from './forecastVersionTypes';

describe('ForecastVersionRepository contract', () => {
  it('should have required methods', () => {
    expect(typeof mockForecastVersionRepository.getForecastVersions).toBe('function');
    expect(typeof mockForecastVersionRepository.getForecastVersionById).toBe('function');
    expect(typeof mockForecastVersionRepository.getForecastVersionsByProgramId).toBe('function');
    expect(typeof mockForecastVersionRepository.getForecastVersionsByProjectId).toBe('function');
    expect(typeof mockForecastVersionRepository.saveForecastVersion).toBe('function');
    expect(typeof mockForecastVersionRepository.compareForecastVersions).toBe('function');
  });
});

describe('MockForecastVersionRepository', () => {
  let repo: typeof mockForecastVersionRepository;
  beforeEach(() => {
    repo = mockForecastVersionRepository;
  });

  it('returns forecast versions', async () => {
    const versions = await repo.getForecastVersions();
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.length).toBeGreaterThan(0);
  });

  it('filters by scope', async () => {
    const program = await repo.getForecastVersions({ scope: ForecastVersionScope.Program });
    expect(program.every(v => v.scope === ForecastVersionScope.Program)).toBe(true);
    const project = await repo.getForecastVersions({ scope: ForecastVersionScope.Project });
    expect(project.every(v => v.scope === ForecastVersionScope.Project)).toBe(true);
  });

  it('filters by kind', async () => {
    const baseline = await repo.getForecastVersions({ kind: ForecastVersionKind.Baseline });
    expect(baseline.every(v => v.kind === ForecastVersionKind.Baseline)).toBe(true);
  });

  it('filters by status', async () => {
    const active = await repo.getForecastVersions({ status: ForecastVersionStatus.Active });
    expect(active.every(v => v.status === ForecastVersionStatus.Active)).toBe(true);
  });

  it('filters by programId', async () => {
    const prog = await repo.getForecastVersions({ programId: 'prog-1' });
    expect(prog.every(v => v.programId === 'prog-1')).toBe(true);
  });

  it('filters by projectId', async () => {
    const proj = await repo.getForecastVersions({ projectId: 'proj-1' });
    expect(proj.every(v => v.projectId === 'proj-1')).toBe(true);
  });

  it('getForecastVersionById returns expected version', async () => {
    const version = await repo.getForecastVersionById('ver-prog-2026-baseline');
    expect(version).toBeDefined();
    expect(version?.id).toBe('ver-prog-2026-baseline');
  });

  it('saveForecastVersion stores and retrieves a new version', async () => {
    const newVersion: ForecastVersion = {
      id: 'ver-prog-2026-scenario',
      name: 'Program 2026 Scenario',
      scope: ForecastVersionScope.Program,
      kind: ForecastVersionKind.Scenario,
      status: ForecastVersionStatus.Draft,
      programId: 'prog-1',
      fiscalYear: 2026,
      versionMonth: '2026-03',
      createdBy: 'user4',
      createdAt: '2026-03-01T00:00:00Z',
      snapshotLines: [],
    };
    await repo.saveForecastVersion(newVersion);
    const found = await repo.getForecastVersionById('ver-prog-2026-scenario');
    expect(found).toBeDefined();
    expect(found?.kind).toBe(ForecastVersionKind.Scenario);
  });

  it('compareForecastVersions returns valid delta comparison', async () => {
    const result = await repo.compareForecastVersions('ver-prog-2026-baseline', 'ver-prog-2026-current');
    expect(result).toBeDefined();
    expect(Array.isArray(result?.deltas)).toBe(true);
    expect(typeof result?.summary).toBe('object');
  });

  it('does not trigger fetch/network calls', async () => {
    if (typeof globalThis.fetch === 'function') {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      await repo.getForecastVersions();
      await repo.getForecastVersionById('ver-prog-2026-baseline');
      await repo.getForecastVersionsByProgramId('prog-1');
      await repo.getForecastVersionsByProjectId('proj-1');
      await repo.saveForecastVersion({
        id: 'ver-prog-2026-scenario',
        name: 'Program 2026 Scenario',
        scope: ForecastVersionScope.Program,
        kind: ForecastVersionKind.Scenario,
        status: ForecastVersionStatus.Draft,
        programId: 'prog-1',
        fiscalYear: 2026,
        versionMonth: '2026-03',
        createdBy: 'user4',
        createdAt: '2026-03-01T00:00:00Z',
        snapshotLines: [],
      });
      await repo.compareForecastVersions('ver-prog-2026-baseline', 'ver-prog-2026-current');
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    }
  });

  it('returns safe copies (no mutation leaks)', async () => {
    const versions = await repo.getForecastVersions();
    if (versions.length > 0) {
      const original = versions[0];
      original.id = 'tampered';
      const again = await repo.getForecastVersions();
      expect(again[0].id).not.toBe('tampered');
    }
  });
});
