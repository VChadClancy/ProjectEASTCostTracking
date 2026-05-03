import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as env from '../config/env';
import * as factory from './repositoryFactory';
import { PrismaFinancialLineRepository } from './prismaFinancialLineRepository';
import { mockFinancialLineRepository } from './mockFinancialLineRepository';
import { mockProgramPlanningRepository } from './mockProgramPlanningRepository';
import { mockCalendarCapacityRepository } from './mockCalendarCapacityRepository';

// Mock getPrismaClient for the relevant test
vi.mock('../db/prismaClient', () => ({
  getPrismaClient: vi.fn(),
}));
import { getPrismaClient } from '../db/prismaClient';

describe('repositoryFactory', () => {
  let originalConfig: any;
  beforeEach(() => {
    originalConfig = { ...env.config };
  });
  afterEach(() => {
    Object.assign(env.config, originalConfig);
    vi.restoreAllMocks();
  });

  it('returns mock repositories by default', () => {
    env.config.REPOSITORY_MODE = 'mock';
    expect(factory.getFinancialLineRepository()).toBe(mockFinancialLineRepository);
    expect(factory.getProgramPlanningRepository()).toBe(mockProgramPlanningRepository);
    expect(factory.getCalendarCapacityRepository()).toBe(mockCalendarCapacityRepository);
  });

  it('falls back to mock for invalid mode', () => {
    // @ts-expect-error: purposely assign invalid value to test fallback
    env.config.REPOSITORY_MODE = 'invalid';
    expect(factory.getFinancialLineRepository()).toBe(mockFinancialLineRepository);
    expect(factory.getProgramPlanningRepository()).toBe(mockProgramPlanningRepository);
    expect(factory.getCalendarCapacityRepository()).toBe(mockCalendarCapacityRepository);
  });

  it('returns PrismaFinancialLineRepository for financial lines in prisma mode', () => {
    env.config.REPOSITORY_MODE = 'prisma';
    const repo = factory.getFinancialLineRepository();
    expect(repo).toBeInstanceOf(PrismaFinancialLineRepository);
  });

  it('does not initialize Prisma at import time', () => {
    env.config.REPOSITORY_MODE = 'prisma';
    factory.getFinancialLineRepository();
    expect(getPrismaClient).not.toHaveBeenCalled();
  });

  it('ProgramPlanning and CalendarCapacity remain mock in prisma mode', () => {
    env.config.REPOSITORY_MODE = 'prisma';
    expect(factory.getProgramPlanningRepository()).toBe(mockProgramPlanningRepository);
    expect(factory.getCalendarCapacityRepository()).toBe(mockCalendarCapacityRepository);
  });
});
