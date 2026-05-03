import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaFinancialLineRepository } from './prismaFinancialLineRepository';
import { getPrismaClient, resetPrismaClientForTests } from '../db/prismaClient';

const shouldRun = process.env.RUN_DB_SMOKE_TESTS === 'true';

(shouldRun ? describe : describe.skip)('PrismaFinancialLineRepository Smoke Test', () => {
  let repo: PrismaFinancialLineRepository;
  let prisma: ReturnType<typeof getPrismaClient>;
  let testIds: { [key: string]: string } = {};

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set');
    prisma = getPrismaClient();
    // Insert minimal prerequisite records
    const program = await prisma.program.create({ data: { name: 'Test Program' } });
    const project = await prisma.project.create({ data: { name: 'Test Project', programId: program.id } });
    const car = await prisma.car.create({ data: { name: 'Test Car', projectId: project.id } });
    const workstream = await prisma.workstream.create({ data: { name: 'Test Workstream' } });
    const fiscalYear = await prisma.fiscalYear.create({ data: { year: 2099 } });
    const fiscalPeriod = await prisma.fiscalPeriod.create({ data: { name: 'Test Period', startDate: new Date(), endDate: new Date(), fiscalYearId: fiscalYear.id } });
    const budgetStream = await prisma.budgetStream.create({ data: { name: 'Test BudgetStream' } });
    // Insert FinancialLine
    const financialLine = await prisma.financialLine.create({
      data: {
        programId: program.id,
        projectId: project.id,
        carId: car.id,
        workstreamId: workstream.id,
        fiscalYearId: fiscalYear.id,
        fiscalPeriodId: fiscalPeriod.id,
        budgetStreamId: budgetStream.id,
        amount: 1000,
        actualAmount: 1100,
        forecastAmount: 1000,
      },
    });
    testIds = { programId: program.id, projectId: project.id, carId: car.id, workstreamId: workstream.id, fiscalYearId: fiscalYear.id, fiscalPeriodId: fiscalPeriod.id, budgetStreamId: budgetStream.id, financialLineId: financialLine.id };
    repo = new PrismaFinancialLineRepository(prisma);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.financialLine.deleteMany({ where: { id: testIds.financialLineId } });
    await prisma.budgetStream.deleteMany({ where: { id: testIds.budgetStreamId } });
    await prisma.fiscalPeriod.deleteMany({ where: { id: testIds.fiscalPeriodId } });
    await prisma.fiscalYear.deleteMany({ where: { id: testIds.fiscalYearId } });
    await prisma.workstream.deleteMany({ where: { id: testIds.workstreamId } });
    await prisma.car.deleteMany({ where: { id: testIds.carId } });
    await prisma.project.deleteMany({ where: { id: testIds.projectId } });
    await prisma.program.deleteMany({ where: { id: testIds.programId } });
    await resetPrismaClientForTests();
  });

  it('getFinancialLines returns records', async () => {
    const lines = await repo.getFinancialLines();
    expect(Array.isArray(lines)).toBe(true);
    expect(lines.length).toBeGreaterThan(0);
  });

  it('getFinancialLineById returns the seeded record', async () => {
    const line = await repo.getFinancialLineById(testIds.financialLineId);
    expect(line).toBeDefined();
    expect(line.id).toBe(testIds.financialLineId);
    expect(line.actualAmount).toBe(1100);
    expect(line.forecastAmount).toBe(1000);
    expect(line.varianceAmount).toBe(100);
  });

  it('getFinancialLines filter by programId works', async () => {
    const lines = await repo.getFinancialLines({ programId: testIds.programId });
    expect(lines.some(l => l.id === testIds.financialLineId)).toBe(true);
  });
});
