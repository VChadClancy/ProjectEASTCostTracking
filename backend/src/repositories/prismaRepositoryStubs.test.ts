import { describe, it, expect } from 'vitest';
import {
  PrismaProgramPlanningRepository,
  PrismaFinancialLineRepository,
  PrismaCalendarCapacityRepository
} from './index';
import { NotImplementedError } from './prismaRepositoryUtils';

// Mock PrismaClient for injection
const mockPrisma = {} as any;

function expectNotImplementedError(e: any) {
  expect(e).toBeInstanceOf(NotImplementedError);
  expect(e.message).toMatch(/not implemented/i);
}

describe('Prisma repository stubs', () => {
  it('PrismaProgramPlanningRepository can be constructed', () => {
    expect(() => new PrismaProgramPlanningRepository()).not.toThrow();
    expect(() => new PrismaProgramPlanningRepository(mockPrisma)).not.toThrow();
  });
  it('PrismaFinancialLineRepository can be constructed', () => {
    expect(() => new PrismaFinancialLineRepository()).not.toThrow();
    expect(() => new PrismaFinancialLineRepository(mockPrisma)).not.toThrow();
  });
  it('PrismaCalendarCapacityRepository can be constructed', () => {
    expect(() => new PrismaCalendarCapacityRepository()).not.toThrow();
    expect(() => new PrismaCalendarCapacityRepository(mockPrisma)).not.toThrow();
  });

  it('PrismaProgramPlanningRepository methods throw NotImplementedError', async () => {
    const repo = new PrismaProgramPlanningRepository();
    await expect(repo.getPrograms()).rejects.toThrow(NotImplementedError);
    await expect(repo.getProgramById('x')).rejects.toThrow(NotImplementedError);
    await expect(repo.getProjects()).rejects.toThrow(NotImplementedError);
    await expect(repo.getProjectById('x')).rejects.toThrow(NotImplementedError);
    await expect(repo.getCars()).rejects.toThrow(NotImplementedError);
    await expect(repo.getCarById('x')).rejects.toThrow(NotImplementedError);
    await expect(repo.getWorkstreams()).rejects.toThrow(NotImplementedError);
  });

  it('PrismaFinancialLineRepository read methods require client or DATABASE_URL', async () => {
    const repo = new PrismaFinancialLineRepository(mockPrisma);
    // Should not throw NotImplementedError, but will likely fail due to mock
    await expect(repo.getFinancialLines()).rejects.not.toThrow(NotImplementedError);
    await expect(repo.getFinancialLineById('x')).rejects.not.toThrow(NotImplementedError);
  });

  it('PrismaCalendarCapacityRepository methods throw NotImplementedError', async () => {
    const repo = new PrismaCalendarCapacityRepository();
    await expect(repo.getFiscalYears()).rejects.toThrow(NotImplementedError);
    await expect(repo.getFiscalPeriods()).rejects.toThrow(NotImplementedError);
    await expect(repo.getHolidayCalendars()).rejects.toThrow(NotImplementedError);
    await expect(repo.getHolidays()).rejects.toThrow(NotImplementedError);
    await expect(repo.getResources()).rejects.toThrow(NotImplementedError);
    await expect(repo.getResourceAvailability('x')).rejects.toThrow(NotImplementedError);
    await expect(repo.getForecastCalendarContext('x')).rejects.toThrow(NotImplementedError);
  });
});
