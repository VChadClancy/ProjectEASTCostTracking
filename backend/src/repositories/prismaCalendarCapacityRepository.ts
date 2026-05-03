import { CalendarCapacityRepository } from './calendarCapacityRepository';
import { NotImplementedError } from './prismaRepositoryUtils';
import { getPrismaClient } from '../db/prismaClient';
import type { PrismaClient } from '@prisma/client';

export class PrismaCalendarCapacityRepository implements CalendarCapacityRepository {
  private prisma: PrismaClient;
  constructor(prisma?: PrismaClient) {
    this.prisma = prisma ?? undefined as any;
    // Do not call getPrismaClient unless needed in future
  }
  async getFiscalYears(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getFiscalPeriods(fiscalYearId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getHolidayCalendars(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getHolidays(calendarId?: string): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getResources(): Promise<any[]> {
    throw new NotImplementedError();
  }
  async getResourceAvailability(resourceId: string): Promise<any> {
    throw new NotImplementedError();
  }
  async getForecastCalendarContext(programId: string): Promise<any> {
    throw new NotImplementedError();
  }
}
