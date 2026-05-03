# Prisma & Database Implementation Status

## Current Status (Sprint 9 Checkpoint 74)

- **Prisma** is installed and configured (Prisma 7).
- **PostgreSQL** is the target database.
- `schema.prisma` contains initial EPFOS models and validates successfully.
- Prisma validate/generate scripts are available.
- **Prisma Client** can be generated from the schema.
- A **Prisma Client wrapper** exists for usage in the codebase.
- **Repository skeletons** for Prisma exist and are aligned with contracts, but are not implemented.
- **Runtime** still defaults to mock repositories (no live database queries).
- **First migration workflow is now available for local development.**

## Migration Workflow (Local Development Only)

- Start local PostgreSQL using Docker Compose (see [../docs/local-database-setup.md](../docs/local-database-setup.md)).
- Run the first migration with:
  ```
  DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev npm run prisma:migrate:dev
  ```
- Check migration status with:
  ```
  DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev npm run prisma:migrate:status
  ```
- This workflow is for **local development only**. No migrations are applied in production or staging.
- The backend runtime still defaults to mock repositories (`REPOSITORY_MODE=mock`).

## Not Implemented Yet

- No active database connection in runtime (no real DB queries at runtime).
- No Prisma repository queries implemented.
- No production database is configured or used.
- No frontend/backend persistence integration (all persistence is mocked).
- No migration SQL files are included in the repo yet.
- No seed scripts are provided yet.

## Safe Commands (for local development)

```
DATABASE_URL="postgresql://user:password@localhost:5432/epfos_dev" npm run prisma:validate
DATABASE_URL="postgresql://user:password@localhost:5432/epfos_dev" npm run prisma:generate
npm run typecheck
npm run test
npm run build
```

---

See also: [local-database-setup.md](../docs/local-database-setup.md)
