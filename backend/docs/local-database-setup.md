# Local Database Setup for EPFOS Backend

## Purpose
This document describes how to set up and validate a local PostgreSQL database for EPFOS backend development using Prisma. It is intended for developers preparing for database integration and CRUD validation.

---

## 1. Start Local PostgreSQL (Docker Compose)

From the `backend` directory:

```
docker compose up -d
```

To stop the database:

```
docker compose down
```

To check status:

```
docker compose ps
```

You should see a container named `epfos-postgres` with status `healthy`.

---

## 2. Local Development Database URL

```
DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev
```

This is set in `.env.example`.

---

## 3. Prisma: Validate & Generate

Validate schema:

```
DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:validate
```

Generate Prisma client:

```
DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:generate
```

---

## 4. Check Migration Status

```
DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:migrate:status
```

---

## 5. Run Guarded DB Smoke Tests

### DB Connection Smoke Test

```
RUN_DB_SMOKE_TESTS=true DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/db/prismaConnection.smoke.test.ts
```

### FinancialLine Repository Smoke Test

```
RUN_DB_SMOKE_TESTS=true DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/repositories/prismaFinancialLineRepository.smoke.test.ts
```

### FinancialLine Service Smoke Test

```
RUN_DB_SMOKE_TESTS=true REPOSITORY_MODE=prisma DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- src/services/financialLineService.smoke.test.ts
```

---

## 6. Current Runtime Behavior

- **Default runtime:** `REPOSITORY_MODE=mock` (all persistence is mocked)
- **Prisma runtime:** `REPOSITORY_MODE=prisma` (FinancialLine only, guarded/local only)
- **FinancialLine:** Only service currently wired for Prisma mode
- **ProgramPlanning & CalendarCapacity:** Remain mock/stubbed in Prisma mode

---

## 7. Not Implemented Yet

- No production database
- No deployed persistence environment
- No frontend/backend persistence integration
- No broad Prisma CRUD for Program, Project, CAR, Calendar, Resource, or Capacity
- No auth/RBAC/audit enforcement

---

For more details, see [../prisma/README.md](../prisma/README.md) and [../README.md](../README.md).
