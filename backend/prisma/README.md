# Prisma Migration Structure

This directory contains Prisma migration files for the PostgreSQL database.

- **Prisma** is the ORM for database access and migrations.
- **PostgreSQL** is the database engine.
- `schema.prisma` now includes initial core EPFOS models and calendar-aware forecasting models.
- Relation validation errors have been fixed by adding missing opposite relation fields and relation names.
- Migrations are not implemented yet.
- Migration files will be created in the `migrations/` subdirectory when models are added to the database.
- The `DATABASE_URL` environment variable will be required when real persistence is enabled.
- The backend still runs in mock repository mode by default; Prisma is not yet used at runtime.
