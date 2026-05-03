// backend/src/db/prismaClient.ts
// Prisma Client wrapper stub for future database access.
// NOTE: Prisma runtime access is NOT active yet. Do not use in production code.
// This module is safe to import even if DATABASE_URL is not set.
// The PrismaClient instance is only created when getPrismaClient() is called.

import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | undefined;

/**
 * Returns a PrismaClient instance. Only creates the client if called.
 * Throws if @prisma/client is not installed or DATABASE_URL is missing at runtime.
 * Do not use in production code until repository mode is switched.
 */
export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to initialize PrismaClient.');
  }
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

export async function resetPrismaClientForTests(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = undefined;
  }
}
// NOTE: Prisma runtime access is NOT active yet. Do not use in production code.
