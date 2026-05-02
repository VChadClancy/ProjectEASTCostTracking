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

describe('programPlanningService', () => {
  it('getPrograms returns mock programs', () => {
    const result = getPrograms();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
  });

  it('getProgramById returns the expected program', () => {
    const program = getProgramById('program-1');
    expect(program).toBeTruthy();
    expect(program?.id).toBe('program-1');
    expect(getProgramById('not-found')).toBeNull();
  });

  it('getProjects returns all projects if no programId', () => {
    const all = getProjects();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getProjects filters by programId', () => {
    const filtered = getProjects('program-1');
    expect(filtered.every(p => p.programId === 'program-1')).toBe(true);
    expect(getProjects('not-found')).toEqual([]);
  });

  it('getProjectById returns the expected project', () => {
    const project = getProjectById('project-1');
    expect(project).toBeTruthy();
    expect(project?.id).toBe('project-1');
    expect(getProjectById('not-found')).toBeNull();
  });

  it('getCars returns all cars if no projectId', () => {
    const all = getCars();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  it('getCars filters by projectId', () => {
    const filtered = getCars('project-1');
    expect(filtered.every(c => c.projectId === 'project-1')).toBe(true);
    expect(getCars('not-found')).toEqual([]);
  });

  it('getCarById returns the expected CAR', () => {
    const car = getCarById('car-1');
    expect(car).toBeTruthy();
    expect(car?.id).toBe('car-1');
    expect(getCarById('not-found')).toBeNull();
  });

  it('getWorkstreams returns mock workstreams', () => {
    const ws = getWorkstreams();
    expect(Array.isArray(ws)).toBe(true);
    expect(ws.length).toBeGreaterThan(0);
    expect(ws[0]).toHaveProperty('id');
  });
});
