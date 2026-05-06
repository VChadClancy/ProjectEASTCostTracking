# Atlas OS MED Engineering Guidance

## 1. Product Positioning
- **Atlas OS is not**: ERP, accounting software, procurement software, expense approval software, timekeeping software, project scheduling software, or portfolio management software.
- **Atlas OS is**: a clean financial control layer for planning, forecasting, actuals intake, timeline visibility, variance insight, and executive decision support.
- **Design Principle**: Simple surface. Serious backend.

## 2. MED UX Principles
- Clarity
- Simplicity
- Speed
- Focus
- Progressive disclosure
- Embedded intelligence
- One primary purpose per screen
- Avoid ERP-style density

## 3. Locked Navigation Model
- Executive Dashboard
- Program Workspace
- Forecasting
- Actuals Intake
- Timeline
- Scenarios
- Approvals
- Reports
- Settings
- Atlas AI should be contextual, not a primary nav item.

## 4. Sprint 11 Engineering Scope
- Eaton-aligned MED design tokens
- Persistent left rail navigation
- Top bar
- Workspace layout system
- Route placeholders
- Reusable shell components
- Preserve current financial content inside shell

## 5. Sprint 11 Out of Scope
- No full financial line create/edit workflow
- No actuals intake workflow
- No dashboard redesign
- No AI implementation
- No auth/RBAC
- No production deployment

## 6. Eaton-Aligned Color Guidance
- Eaton Blue #005EB8
- Eaton Dark Blue #004B85
- Charcoal #333F48
- Medium Gray #98A4AE
- White #FFFFFF
- Black #000000
- Green #4C9D2B
- Yellow #FFD100
- Red #D22730
- Teal #00B2A9
- Use Eaton Blue as a precision accent, not as a heavy full-screen color.
- Keep the application mostly neutral, premium, and uncluttered.

### MED Design Tokens
- See `src/styles/atlasTheme.ts` for the reusable, Eaton-aligned MED design tokens (colors, layout, and typography).
- All new UI work should use these tokens for consistency and brand alignment.

## 6. Atlas App Shell Documentation
For detailed documentation on the Atlas App Shell, including its responsibilities, navigation model, design token locations, and future usage, see [atlas-os-app-shell.md](./atlas-os-app-shell.md).

## 7. Locked Future Capability Areas
- Program Financial Workspace
- Forecast Management
- Calendar-Aware Forecasting
- Actuals Intake Engine
- Financial Timeline View
- Variance + Insight
- Governance Controls
- Embedded AI Intelligence

## 8. Engineering Rule
- Every Sprint 11 UI decision should support the MED shell and not introduce feature-heavy workflow complexity.
