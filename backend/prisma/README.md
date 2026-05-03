# Prisma & Database Implementation Status

## Current Status (Sprint 8 Checkpoint 70)

- **Prisma** is installed and configured (Prisma 7).
- **PostgreSQL** is the target database.
- `schema.prisma` contains initial EPFOS models and validates successfully.
- Prisma validate/generate scripts are available.
- **Prisma Client** can be generated from the schema.
- A **Prisma Client wrapper** exists for usage in the codebase.
- **Repository skeletons** for Prisma exist and are aligned with contracts, but are not implemented.
- **Runtime** still defaults to mock repositories (no live database queries).

## Not Implemented Yet

- No active database connection in runtime (no real DB queries at runtime).
- No Prisma repository queries implemented.
- No migrations have been applied to a real database.
- No production database is configured or used.
- No frontend/backend persistence integration (all persistence is mocked).

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
