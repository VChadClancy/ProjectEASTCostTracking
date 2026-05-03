# Local Database Setup for EPFOS Backend

## Purpose
This document describes how to set up a local PostgreSQL database for EPFOS backend development using Prisma. It is intended for developers preparing for future database integration and testing.

## Current Status (Sprint 9 Checkpoint 74)
- **Prisma** is installed and configured for PostgreSQL.
- `schema.prisma` contains initial EPFOS models and validates.
- No migrations have been applied to a real database yet.
- All runtime persistence is still mocked; no live database queries.
- **First migration workflow is now available for local development.**

## Local PostgreSQL with Docker (Recommended)

A pre-configured Docker Compose file is provided for local development. This will run PostgreSQL 16 in a container with persistent storage.

### Start the Database

From the `backend` directory:

```
docker compose up -d
```

### Stop the Database

```
docker compose down
```

### Verify Database is Running

```
docker compose ps
```

You should see a container named `epfos-postgres` with status `healthy`.

You can also check health directly:

```
docker exec epfos-postgres pg_isready -U epfos_user -d epfos_dev
```

### Local Development Database URL

```
DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev
```

This is already set in `.env.example`.

### Running the First Local Migration

Once PostgreSQL is running, you can apply the first migration (this will create the database tables as defined in `schema.prisma`).

From the `backend` directory:

```
DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev npm run prisma:migrate:dev
```

When prompted for a migration name, **enter**:

```
init_epfos_schema
```

This will create and apply the initial migration to your local database.

### Checking Migration Status

To check the status of migrations:

```
DATABASE_URL=postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev npm run prisma:migrate:status
```

This will show which migrations have been applied to your local database.

### Running a Database Connectivity Smoke Test (Optional)

A minimal database connectivity test is available for local development. This test is **skipped by default** and will only run if you explicitly enable it with an environment variable.

To run the smoke test:

```
RUN_DB_SMOKE_TESTS=true DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run test -- prismaConnection.smoke.test.ts
```

- The test will connect to the database and run a minimal query.
- If `RUN_DB_SMOKE_TESTS` is not set to `true`, the test will be skipped.
- This is for local development only and is **not required for CI or GitHub Actions**.

### Notes
- This migration workflow is for **local development only**. Do not use for production or staging.
- The backend runtime still defaults to mock repositories. No live database queries are performed yet. Set `REPOSITORY_MODE=mock` (default).
- No migration SQL files are included in the repo yet.
- No seed scripts are provided yet.
- See [../prisma/README.md](../prisma/README.md) for more Prisma usage details.

## Manual Local PostgreSQL Option

You may also install PostgreSQL locally (e.g., via [Postgres.app](https://postgresapp.com/) or [Homebrew](https://brew.sh/)) and create a database/user matching the above credentials.

## Safe Commands

```
DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:validate
DATABASE_URL="postgresql://epfos_user:epfos_password@localhost:5432/epfos_dev" npm run prisma:generate
npm run typecheck
npm run test
npm run build
```

## Current Status
- **No production database is configured yet.**
- **Runtime remains in mock repository mode by default.**
- **Prisma repositories are not active yet.**
- **A valid `DATABASE_URL` is required for Prisma tooling, but the app does not use the database at runtime.**

## Required Tools
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)
- [PostgreSQL](https://www.postgresql.org/) (local install **or** Docker)

## Example `DATABASE_URL`
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/epfos_local"
```

## Setting Up Environment Variables
1. Copy the example environment file:
   ```sh
   cp backend/.env.example backend/.env
   ```
2. Edit `backend/.env` to set your `DATABASE_URL` as above.

## Prisma Tooling
- **Validate schema:**
  ```sh
  npm run prisma:validate
  ```
- **Generate Prisma client:**
  ```sh
  npm run prisma:generate
  ```
- **(Future) Run migrations:**
  ```sh
  # Placeholder: migrations will be documented in a future sprint
  # npx prisma migrate dev
  ```

## Repository Mode
- The application uses the `REPOSITORY_MODE` environment variable to determine which repository implementation to use.
- **Default is mock repository mode.**
- Setting up a database and `DATABASE_URL` does **not** activate Prisma repositories at runtime.
- Switching to Prisma repositories will be enabled in a future sprint.

## Troubleshooting
- Ensure PostgreSQL is running and accessible at the host/port in your `DATABASE_URL`.
- If you see connection errors, check credentials and network settings.
- Prisma commands require a valid `DATABASE_URL` even if the app does not use the database at runtime.
- If you change the schema, always re-run `npm run prisma:generate`.

---

**For more details, see the main [backend README](../README.md).**
