// To run this smoke test:
// RUN_DB_SMOKE_TESTS=true REPOSITORY_MODE=prisma DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/services/financialLineService.smoke.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  getFinancialLines,
  getFinancialLineById,
  createFinancialLine,
  updateFinancialLine
} from './financialLineService';
import { getPrismaClient, resetPrismaClientForTests } from '../db/prismaClient';

const shouldRun = process.env.RUN_DB_SMOKE_TESTS === 'true';
const describeIf = shouldRun ? describe : describe.skip;

type Program = { id: string };
type Project = { id: string };
type Car = { id: string };
type Workstream = { id: string };
type FiscalYear = { id: string };
type FiscalPeriod = { id: string };
type BudgetStream = { id: string };
type CostCategory = { id: string };

const TEST_PREFIX = 'smoketest-';

let program: Program;
let project: Project;
let car: Car;
let workstream: Workstream;
let fiscalYear: FiscalYear;
let fiscalPeriod: FiscalPeriod;
let budgetStream: BudgetStream;
let costCategory: CostCategory;
let prisma: ReturnType<typeof getPrismaClient>;
let programId: string | undefined;
let projectId: string | undefined;
let carId: string | undefined;
let workstreamId: string | undefined;
let fiscalYearId: string | undefined;
let fiscalPeriodId: string | undefined;
let budgetStreamId: string | undefined;
let costCategoryId: string | undefined;
let financialLineId: string | undefined;


// Replace cleanup with explicit ID-based cleanup only
async function cleanup() {
  if (!prisma) return;

  if (financialLineId) {
    await prisma.financialLine.deleteMany({ where: { id: financialLineId } });
  }

  if (programId) {
    await prisma.financialLine.deleteMany({ where: { programId } });
  }

  if (carId) {
    await prisma.car.deleteMany({ where: { id: carId } });
  }

  if (projectId) {
    await prisma.project.deleteMany({ where: { id: projectId } });
  }

  if (fiscalPeriodId) {
    await prisma.fiscalPeriod.deleteMany({ where: { id: fiscalPeriodId } });
  }

  if (fiscalYearId) {
    await prisma.fiscalYear.deleteMany({ where: { id: fiscalYearId } });
  }

  if (workstreamId) {
    await prisma.workstream.deleteMany({ where: { id: workstreamId } });
  }

  if (budgetStreamId) {
    await prisma.budgetStream.deleteMany({ where: { id: budgetStreamId } });
  }

  if (costCategoryId) {
    await prisma.costCategory.deleteMany({ where: { id: costCategoryId } });
  }

  if (programId) {
    await prisma.program.deleteMany({ where: { id: programId } });
  }
}

describeIf('financialLineService (Prisma DB smoke)', () => {
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for Prisma smoke tests.');
    }
    process.env.REPOSITORY_MODE = 'prisma';
    prisma = getPrismaClient();
    // Create all required related records with test prefix
    program = await prisma.program.create({ data: { name: `${TEST_PREFIX}Program` } });
    programId = program.id;
    project = await prisma.project.create({ data: { name: `${TEST_PREFIX}Project`, programId: program.id } });
    projectId = project.id;
    car = await prisma.car.create({ data: { name: `${TEST_PREFIX}Car`, projectId: project.id } });
    carId = car.id;
    workstream = await prisma.workstream.create({ data: { name: `${TEST_PREFIX}Workstream` } });
    workstreamId = workstream.id;
    fiscalYear = await prisma.fiscalYear.create({ data: { year: 2026 } });
    fiscalYearId = fiscalYear.id;
    fiscalPeriod = await prisma.fiscalPeriod.create({ data: { name: `${TEST_PREFIX}Period`, startDate: new Date(), endDate: new Date(), fiscalYearId: fiscalYear.id } });
    fiscalPeriodId = fiscalPeriod.id;
    budgetStream = await prisma.budgetStream.create({ data: { name: `${TEST_PREFIX}BudgetStream` } });
    budgetStreamId = budgetStream.id;
    costCategory = await prisma.costCategory.create({ data: { name: `${TEST_PREFIX}CostCategory` } });
    costCategoryId = costCategory.id;
  });

  afterAll(async () => {
    // Delete FinancialLines for this test

    await resetPrismaClientForTests();
    process.env.REPOSITORY_MODE = 'mock';
  });

  it('can fetch lines from DB (may be empty)', async () => {
    const lines = await getFinancialLines();
    expect(Array.isArray(lines)).toBe(true);
  });

  it('can create, fetch, and update a FinancialLine in DB', async () => {
    const input = {
      programId: program.id,
      projectId: project.id,
      carId: car.id,
      workstreamId: workstream.id,
      fiscalYearId: fiscalYear.id,
      fiscalPeriodId: fiscalPeriod.id,
      budgetStreamId: budgetStream.id,
      costCategoryId: costCategory.id,
      amount: 123.45,
      actualAmount: 123.45,
      forecastAmount: 100.00,
      status: 'active'
    };
    const created = await createFinancialLine(input);
    financialLineId = created.id;
    expect(created).toMatchObject({ ...input, amount: expect.any(Number) });
    expect(typeof created.id).toBe('string');

    const found = await getFinancialLineById(created.id);
    expect(found).not.toBeNull();
    if (!found) throw new Error('Line not found after create');
    expect(found.id).toBe(created.id);

    const updated = await updateFinancialLine(created.id, { ...input, actualAmount: 999 });
    expect(updated.actualAmount).toBe(999);
    expect(updated.varianceAmount).toBe(899);
    expect(updated).not.toBeNull();
    if (!updated) throw new Error('Line not found after update');
    expect(updated.id).toBe(created.id);
    expect(updated.actualAmount).toBe(999);
  });
});
