// Repository factory for backend
// Returns repository implementations based on config.REPOSITORY_MODE

import { config } from '../config/env';
import { mockFinancialLineRepository } from './mockFinancialLineRepository';
import { mockProgramPlanningRepository } from './mockProgramPlanningRepository';
import { mockCalendarCapacityRepository } from './mockCalendarCapacityRepository';
import { PrismaFinancialLineRepository } from './prismaFinancialLineRepository';
// import { PrismaProgramPlanningRepository } from './prismaProgramPlanningRepository';
// import { PrismaCalendarCapacityRepository } from './prismaCalendarCapacityRepository';

// FinancialLine
export function getFinancialLineRepository() {
  if (config.REPOSITORY_MODE === 'prisma') {
    // Only FinancialLine has a working Prisma implementation
    return new PrismaFinancialLineRepository();
  }
  // Default and fallback: mock
  return mockFinancialLineRepository;
}

// ProgramPlanning
export function getProgramPlanningRepository() {
  if (config.REPOSITORY_MODE === 'prisma') {
    // TODO: Enable PrismaProgramPlanningRepository when implemented
    // return new PrismaProgramPlanningRepository();
    // For now, fallback to mock for safety
    // (Prisma implementation not active yet)
    return mockProgramPlanningRepository;
  }
  return mockProgramPlanningRepository;
}

// CalendarCapacity
export function getCalendarCapacityRepository() {
  if (config.REPOSITORY_MODE === 'prisma') {
    // TODO: Enable PrismaCalendarCapacityRepository when implemented
    // return new PrismaCalendarCapacityRepository();
    // For now, fallback to mock for safety
    // (Prisma implementation not active yet)
    return mockCalendarCapacityRepository;
  }
  return mockCalendarCapacityRepository;
}
