# Sprint 13: Forecast Versioning + Delta Analysis — Checkpoint 123 Update

## 1. Implemented Domain Model
- **Scope:** Supports both program and project forecast versions
- **Kind:** Supports baseline, current, prior, monthlySnapshot, and scenario kinds
- **Status:** Supports draft, active, locked, and archived status
- **Snapshot Lines:** Canonical `snapshotLines` array for all forecast line data
- **Monthly Snapshots:** Native support for monthly snapshot versions

## 2. Delta Calculation Service
- Calculates amount delta and percent delta between versions
- Handles zero-base (division by zero, missing data) scenarios
- Handles missing, new, and removed snapshot lines
- Groups deltas by project, CAR, budget stream, and cost category
- Classifies severity (low, medium, high) for each delta

## 3. Mock Repository
- Provides deterministic mock forecast versions for both program and project
- Includes baseline, current, and monthly snapshot examples
- Supports save, retrieve, filter, and compare operations
- Enables program budget forecast and project forecast example data

## 4. Service Layer
- Implements:
  - `getForecastVersions`
  - `getForecastVersionById`
  - `getForecastVersionsByProgramId`
  - `getForecastVersionsByProjectId`
  - `saveForecastVersion`
  - `compareForecastVersions`
- Default behavior is mock-backed
- Controlled API-mode behavior supported for integration

## 5. View Model Adapter
- Produces selector items for version pickers
- Produces summary card models for forecast versions
- Produces comparison view models for delta analysis
- Produces delta signal models for grouped deltas
- Produces snapshot summary models
- Provides user-friendly labels (e.g., Program Budget Forecast, Project Forecast)

## 6. Out of Scope (Intentionally Not Implemented in Sprint 13)
- Forecast Management UI
- Forecast grid editing
- Delta visualization UI
- Backend API routes
- Prisma schema migration
- Approval workflow
- Actuals intake
- AI explanation engine
- Production persistence

## 7. Sprint 14 Handoff & Next Steps
- **Forecast Management Workspace v1** can now consume:
  - Forecast version service
  - Repository selector/factory
  - View model adapter
  - Delta calculation service
- **Recommended Sprint 14 Focus:**
  - MED Forecast Management Workspace
  - Version selector UI
  - Forecast version summary cards
  - Basic read-only snapshot view
  - Comparison entry point
  - No heavy grid editing unless explicitly approved

---

**Sprint 13 is now complete for the forecast versioning data model, delta analysis, and supporting service layers. UI and persistence expansion are deferred to Sprint 14.**
