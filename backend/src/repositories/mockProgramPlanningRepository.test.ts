import { describe, it, expect } from 'vitest';
import { mockProgramPlanningRepository } from './mockProgramPlanningRepository';

describe('mockProgramPlanningRepository', () => {
  it('returns all programs', async () => {
    const programs = await mockProgramPlanningRepository.getPrograms();
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBeGreaterThan(0);
  });

  it('returns a program by id', async () => {
    const all = await mockProgramPlanningRepository.getPrograms();
    const found = await mockProgramPlanningRepository.getProgramById(all[0].id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(all[0].id);
  });

  it('returns projects for a program', async () => {
    const all = await mockProgramPlanningRepository.getPrograms();
    const projects = await mockProgramPlanningRepository.getProjects(all[0].id);
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.every(p => p.programId === all[0].id)).toBe(true);
  });

  it('returns a project by id', async () => {
    const all = await mockProgramPlanningRepository.getProjects();
    const found = await mockProgramPlanningRepository.getProjectById(all[0].id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(all[0].id);
  });

  it('returns cars for a project', async () => {
    const all = await mockProgramPlanningRepository.getProjects();
    const cars = await mockProgramPlanningRepository.getCars(all[0].id);
    expect(Array.isArray(cars)).toBe(true);
    expect(cars.every(c => c.projectId === all[0].id)).toBe(true);
  });

  it('returns a car by id', async () => {
    const all = await mockProgramPlanningRepository.getCars();
    const found = await mockProgramPlanningRepository.getCarById(all[0].id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(all[0].id);
  });

  it('returns all workstreams', async () => {
    const workstreams = await mockProgramPlanningRepository.getWorkstreams();
    expect(Array.isArray(workstreams)).toBe(true);
    expect(workstreams.length).toBeGreaterThan(0);
  });
});
