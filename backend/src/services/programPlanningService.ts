// Service for Program Planning: uses repository interface
import { ProgramPlanningRepository, mockProgramPlanningRepository } from '../repositories';

const repo: ProgramPlanningRepository = mockProgramPlanningRepository;

export async function getPrograms() {
  return repo.getPrograms();
}

export async function getProgramById(programId: string) {
  return repo.getProgramById(programId);
}

export async function getProjects(programId?: string) {
  return repo.getProjects(programId);
}

export async function getProjectById(projectId: string) {
  return repo.getProjectById(projectId);
}

export async function getCars(projectId?: string) {
  return repo.getCars(projectId);
}

export async function getCarById(carId: string) {
  return repo.getCarById(carId);
}

export async function getWorkstreams() {
  return repo.getWorkstreams();
}
