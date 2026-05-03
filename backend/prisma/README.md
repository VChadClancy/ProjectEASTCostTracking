# Prisma & Database Implementation Status

## Current Status (Sprint 9 Checkpoint 82)

- **Prisma** is installed and configured (Prisma 7).
- **PostgreSQL** is the target database.
- `schema.prisma` contains initial EPFOS models and validates successfully.
- Prisma validate/generate scripts are available.
- **Prisma Client** can be generated from the schema.
- A **Prisma Client wrapper** exists for usage in the codebase.
- **FinancialLine** repository and service are wired for Prisma and can be tested locally.
- **Repository skeletons** for ProgramPlanning and CalendarCapacity exist but are not active in Prisma mode.
- **Runtime** defaults to mock repositories (`REPOSITORY_MODE=mock`).
- **Prisma runtime path is guarded/local only.**

---

## Migration & Prisma Workflow (Local Development Only)

- Start local PostgreSQL using Docker Compose (see [../docs/local-database-setup.md](../docs/local-database-setup.md)).
- Validate schema:
  ```
  DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:validate
  ```
- Generate Prisma client:
  ```
  DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:generate
  ```
- Check migration status:
  ```
  DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:migrate:status
  ```
- This workflow is for **local development only**. No migrations are applied in production or staging.

---

## Guarded DB Smoke Tests

- **DB Connection Smoke Test:**
  ```
  RUN_DB_SMOKE_TESTS=true DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/db/prismaConnection.smoke.test.ts
  ```
- **FinancialLine Repository Smoke Test:**
  ```
  RUN_DB_SMOKE_TESTS=true DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/repositories/prismaFinancialLineRepository.smoke.test.ts
  ```
- **FinancialLine Service Smoke Test:**
  ```
  RUN_DB_SMOKE_TESTS=true REPOSITORY_MODE=prisma DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/services/financialLineService.smoke.test.ts
  ```

---

## Current Runtime Behavior

- **Default runtime:** `REPOSITORY_MODE=mock` (all persistence is mocked)
- **Prisma runtime:** `REPOSITORY_MODE=prisma` (FinancialLine only, guarded/local only)
- **FinancialLine:** Only service currently wired for Prisma mode
- **ProgramPlanning & CalendarCapacity:** Remain mock/stubbed in Prisma mode

---

## Not Implemented Yet

- No production database
- No deployed persistence environment
- No frontend/backend persistence integration
- No broad Prisma CRUD for Program, Project, CAR, Calendar, Resource, or Capacity
- No auth/RBAC/audit enforcement

---

See also: [local-database-setup.md](../docs/local-database-setup.md)
