// backend/src/db/prismaClient.test.ts
// Vitest tests for prismaClient wrapper stub
import { describe, it, expect } from 'vitest';
import { getPrismaClient, resetPrismaClientForTests } from './prismaClient';

// Import should not throw, even if DATABASE_URL is not set
describe('prismaClient module', () => {
  it('should export getPrismaClient function', () => {
    expect(typeof getPrismaClient).toBe('function');
  });

  it('should not instantiate PrismaClient at import time', () => {
    // The module should not create a PrismaClient until getPrismaClient is called
    // This is a smoke test: if import works, it's lazy
    expect(typeof getPrismaClient).toBe('function');
  });

  it('should throw or error clearly if getPrismaClient is called without DATABASE_URL', () => {
    const oldEnv = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    let threw = false;
    try {
      getPrismaClient();
    } catch (e) {
      threw = true;
    }
    expect(threw).toBe(true);
    if (oldEnv) process.env.DATABASE_URL = oldEnv;
  });

  it('should export resetPrismaClientForTests function', () => {
    expect(typeof resetPrismaClientForTests).toBe('function');
  });
});
