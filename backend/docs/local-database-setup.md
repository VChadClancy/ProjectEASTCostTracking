# Local Database Setup for EPFOS Backend

## Purpose
This document describes how to set up a local PostgreSQL database for EPFOS backend development using Prisma. It is intended for developers preparing for future database integration and testing.

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

## Local PostgreSQL Option
1. Install PostgreSQL locally (e.g., via [Postgres.app](https://postgresapp.com/) or [Homebrew](https://brew.sh/)).
2. Create a database for EPFOS (e.g., `epfos_local`).

## Docker PostgreSQL Option
1. Run a PostgreSQL container:
   ```sh
   docker run --name epfos-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=epfos_local -p 5432:5432 -d postgres:15
   ```
2. Connect using the same credentials as the local option.

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
