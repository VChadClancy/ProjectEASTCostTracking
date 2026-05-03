import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getPrismaClient } from './prismaClient';

const shouldRun = process.env.RUN_DB_SMOKE_TESTS === 'true';

(shouldRun ? describe : describe.skip)('Prisma DB Connection Smoke Test', () => {
  let prisma: ReturnType<typeof getPrismaClient>;

  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set to run DB smoke tests');
    }
    prisma = getPrismaClient();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  it('should connect and run a minimal query', async () => {
    // Minimal query: SELECT 1
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`;
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].result).toBe(1);
  });
});
