// Mock implementation of ProgramPlanningRepository
import { ProgramPlanningRepository } from './programPlanningRepository';
import { programs, projects, cars, workstreams, resources, resourceAvailability } from '../data/mockProgramData';

export class MockProgramPlanningRepository implements ProgramPlanningRepository {
  async getPrograms(): Promise<any[]> {
    return programs;
  }
  async getProgramById(programId: string): Promise<any | null> {
    return programs.find(p => p.id === programId) || null;
  }
  async getProjects(programId?: string): Promise<any[]> {
    if (programId) return projects.filter(p => p.programId === programId);
    return projects;
  }
  async getProjectById(projectId: string): Promise<any | null> {
    return projects.find(p => p.id === projectId) || null;
  }
  async getCars(projectId?: string): Promise<any[]> {
    if (projectId) return cars.filter(c => c.projectId === projectId);
    return cars;
  }
  async getCarById(carId: string): Promise<any | null> {
    return cars.find(c => c.id === carId) || null;
  }
  async getWorkstreams(): Promise<any[]> {
    return workstreams;
  }
}

export const mockProgramPlanningRepository = new MockProgramPlanningRepository();
