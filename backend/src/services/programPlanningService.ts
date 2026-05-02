// Service for Program Planning: provides access to mock data for programs, projects, CARs, and workstreams
import { programs, projects, cars, workstreams } from '../data/mockProgramData';

export function getPrograms() {
  return programs;
}

export function getProgramById(programId: string) {
  return programs.find(p => p.id === programId) || null;
}

export function getProjects(programId?: string) {
  if (programId) {
    return projects.filter(p => p.programId === programId);
  }
  return projects;
}

export function getProjectById(projectId: string) {
  return projects.find(p => p.id === projectId) || null;
}

export function getCars(projectId?: string) {
  if (projectId) {
    return cars.filter(c => c.projectId === projectId);
  }
  return cars;
}

export function getCarById(carId: string) {
  return cars.find(c => c.id === carId) || null;
}

export function getWorkstreams() {
  return workstreams;
}
