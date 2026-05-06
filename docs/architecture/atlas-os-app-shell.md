# Atlas OS App Shell

## Purpose
The `AtlasAppShell` provides the foundational layout and navigation structure for Atlas OS applications. It ensures a consistent user experience and visual hierarchy across all program modules.

## Shell Responsibilities

### Left Rail
- Hosts the primary navigation for the application.
- Allows users to switch between major functional areas (e.g., Program Workspace, Forecasting, Actuals Intake, Timeline, Scenarios, Approvals, Reports, Settings).
- Navigation model is defined in `src/components/shell/` and referenced by the shell.

### Top Bar
- Displays the current workspace/project context and page title.
- Hosts global actions, notifications, and user/account controls.
- Provides access to contextual help and the "Ask Atlas" placeholder.

### Main Workspace
- The main content area where feature screens are rendered.
- Program Workspace, Forecasting, Actuals Intake, and other modules plug into this region.

### "Ask Atlas" Placeholder
- Present in the top bar as a non-functional placeholder in Sprint 11.
- Intended for future contextual AI/insight features.

## Navigation Model Location
- The navigation model is located in `src/components/shell/`.

## Design Token Module Location
- Atlas MED design tokens are defined in `src/styles/atlasTheme.ts`.

## Reusable Shell Component Locations
- Shell components are located in `src/components/shell/`.
  - `AtlasAppShell`: Main shell layout
  - `PageHeader`: Page-level header
  - `WorkspaceCard`: Card layout for workspace content

## Sprint 11 Runtime Behavior
- Default frontend mode: mock data
- Optional frontend API mode: available but not default
- Backend default: mock
- Prisma FinancialLine path: guarded, local only

## Out of Scope for Sprint 11
Sprint 11 intentionally does **not** implement:
- Full financial line create/edit workflow
- Actuals intake workflow
- Dashboard redesign
- AI implementation
- Auth/RBAC
- Approval workflow
- Production deployment

## Future Shell Usage
- Program Workspace, Forecasting, and Actuals Intake screens will plug into the main workspace region.
- Timeline, Scenarios, Approvals, Reports, and Settings will use the same shell frame.
- Atlas AI will appear contextually (top bar, right rail, insight cards), not as a primary navigation item.
