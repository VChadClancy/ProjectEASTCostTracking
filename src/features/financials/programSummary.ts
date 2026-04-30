import { getPrograms, getProjects, getCars, getWorkstreams } from './programService';

export interface ProgramSummary {
  programCount: number;
  projectCount: number;
  carCount: number;
  workstreamCount: number;
  totalApprovedCarAmount: number;
  totalCapitalAmount: number;
  totalExpenseAmount: number;
}

export function createProgramSummary(): ProgramSummary {
  const programs = getPrograms();
  const projects = getProjects();
  const cars = getCars();
  const workstreams = getWorkstreams();

  const totalApprovedCarAmount = cars.reduce((sum, car) => sum + (car.approvedAmount || 0), 0);
  const totalCapitalAmount = cars.reduce((sum, car) => sum + (car.capitalAmount || 0), 0);
  const totalExpenseAmount = cars.reduce((sum, car) => sum + (car.expenseAmount || 0), 0);

  return {
    programCount: programs.length,
    projectCount: projects.length,
    carCount: cars.length,
    workstreamCount: workstreams.length,
    totalApprovedCarAmount,
    totalCapitalAmount,
    totalExpenseAmount
  };
}
