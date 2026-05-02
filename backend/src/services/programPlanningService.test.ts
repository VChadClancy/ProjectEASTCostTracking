import { describe, it, expect } from 'vitest';
import {
  getPrograms,
  getProgramById,
  getProjects,
  getProjectById,
  getCars,
  getCarById,
  getWorkstreams
} from './programPlanningService';

// All service functions are now async

describe('programPlanningService', () => {
  it('getPrograms returns mock programs', async () => {
    const result = await getPrograms();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
  });

  it('getProgramById returns the expected program', async () => {
    const program = await getProgramById('program-1');
    expect(program).toBeTruthy();
    expect(program?.id).toBe('program-1');
    expect(await getProgramById('not-found')).toBeNull();
  });

  it('getProjects returns all projects if no programId', async () => {
    const all = await getProjects();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getProjects filters by programId', async () => {
    const filtered = await getProjects('program-1');
    expect(filtered.every(p => p.programId === 'program-1')).toBe(true);
    expect(await getProjects('not-found')).toEqual([]);
  });

  it('getProjectById returns the expected project', async () => {
    const project = await getProjectById('project-1');
    expect(project).toBeTruthy();
    expect(project?.id).toBe('project-1');
    expect(await getProjectById('not-found')).toBeNull();
  });

  it('getCars returns all cars if no projectId', async () => {
    const all = await getCars();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getCars filters by projectId', async () => {
    const filtered = await getCars('project-1');
    expect(filtered.every(c => c.projectId === 'project-1')).toBe(true);
    expect(await getCars('not-found')).toEqual([]);
  });

  it('getCarById returns the expected CAR', async () => {
    const car = await getCarById('car-1');
    expect(car).toBeTruthy();
    expect(car?.id).toBe('car-1');
    expect(await getCarById('not-found')).toBeNull();
  });

  it('getWorkstreams returns mock workstreams', async () => {
    const ws = await getWorkstreams();
    expect(Array.isArray(ws)).toBe(true);
    expect(ws.length).toBeGreaterThan(0);
    expect(ws[0]).toHaveProperty('id');
  });
});
