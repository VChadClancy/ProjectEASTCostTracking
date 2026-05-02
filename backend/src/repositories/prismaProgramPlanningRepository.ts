import { ProgramPlanningRepository } from './programPlanningRepository';
import { NotImplementedError } from './prismaRepositoryUtils';

export class PrismaProgramPlanningRepository implements ProgramPlanningRepository {
  async getPrograms(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getProgramById(programId: string): Promise<any | null> {
    throw new NotImplementedError();
  }
  async getProjects(programId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getProjectById(projectId: string): Promise<any | null> {
    throw new NotImplementedError();
  }
  async getCars(projectId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getCarById(carId: string): Promise<any | null> {
    throw new NotImplementedError();
  }
  async getWorkstreams(): Promise<any[]> {
    throw new NotImplementedError();
  }
}
