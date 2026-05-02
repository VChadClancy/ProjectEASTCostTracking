export interface ProgramPlanningRepository {
  getPrograms(): Promise<any[]>;
  getProgramById(programId: string): Promise<any | null>;
  getProjects(programId?: string): Promise<any[]>;
  getProjectById(projectId: string): Promise<any | null>;
  getCars(projectId?: string): Promise<any[]>;
  getCarById(carId: string): Promise<any | null>;
  getWorkstreams(): Promise<any[]>;
}
