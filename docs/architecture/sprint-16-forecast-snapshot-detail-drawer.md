# Sprint 16: Forecast Snapshot Detail Drawer

## Implemented Scope

### 1. Model
- Drawer header
- Selected line summary
- Financial values
- Monthly context
- Classification details
- Version/source metadata
- Delta context
- Close action
- Read-only selected line detail view model

### 2. Data Adapter
- Transforms selected snapshot line into drawer detail view model
- Normalizes financial values
- Formats forecast / actual / budget / variance
- Handles missing values safely
- Preserves read-only behavior
- Avoids raw JSON
- Avoids user-facing forecastVersionId/internal id leakage
- Supports empty selection fallback

### 3. Drawer Component
- Standalone read-only drawer
- Open/closed behavior
- Safe empty state
- Readable summary-first layout
- Financial KPI-style blocks
- Metadata lower priority
- Close action
- No editing/approval/AI controls

### 4. Forecast Management Integration
- Snapshot preview line supports detail-on-demand
- Selected line opens drawer
- Drawer close behavior works safely
- Forecast Management remains read-first
- Forecast Comparison remains visible/read-only
- Program Workspace remains default app content

### 5. Runtime Behavior
- Frontend default remains mock-backed
- Optional API mode remains controlled
- Backend default remains mock-backed
- Guarded Prisma FinancialLine path remains unchanged

### 6. Scope Guard
- No forecast editing
- No create/edit/delete forecast version workflow
- No approval workflow
- No actuals intake
- No AI forecast explanation
- No backend API routes
- No Prisma schema changes
- No production persistence

### 7. Mandatory Visual Check
- App must be launched locally before PR.
- Forecasting screen must render.
- Snapshot preview must be visible.
- Drawer must open from a snapshot preview line.
- Drawer must close.
- Drawer detail must be readable.
- No raw JSON/debug data should appear.
- No internal forecastVersionId should appear.
- Browser console must be checked for errors.

### 8. Sprint 17 Handoff Options
- **Option A:** Financial Line Management v1
- **Option B:** Forecast Version Create / Save Draft Foundation
- **Option C:** Executive Dashboard / Control Tower v1
- **Option D:** Forecast Management UX Refinement / Responsive Layout Pass

### 9. Recommendation
- Recommend **Financial Line Management v1** if we want to move into planning maintenance.
- Recommend **Forecast Version Create / Save Draft Foundation** if we want to enable controlled forecast updates next.
- Recommend **Executive Dashboard / Control Tower v1** if we want to return to executive visibility.
- Recommend **UX Refinement** if visual validation shows the Forecasting workspace still needs polish.
