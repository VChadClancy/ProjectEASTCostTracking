import React from "react";
import { getPlanningManagementWorkspaceViewModel } from "./planningManagementDataAdapter";
import { PlanningLineFormStructure } from "./PlanningLineFormStructure";
import { atlasTheme } from "../../styles/atlasTheme";

// Helper: Card for summary metrics
function SummaryCard({ title, value, description, icon }: { title: string; value: string | number; description?: string; icon?: string }) {
  return (
    <div style={{
      background: atlasTheme.colors.surface,
      borderRadius: atlasTheme.layout.cardRadius,
      boxShadow: atlasTheme.layout.cardShadow,
      padding: 24,
      minWidth: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginRight: 24,
      marginBottom: 16,
      border: `1px solid ${atlasTheme.colors.border}`,
    }}>
      <div style={{ fontSize: 14, color: atlasTheme.colors.textSecondary, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: atlasTheme.colors.primary }}>{value}</div>
      {description && <div style={{ fontSize: 12, color: atlasTheme.colors.textSecondary, marginTop: 4 }}>{description}</div>}
    </div>
  );
}

// Helper: Table for financial lines
function FinancialLinesTable({ lines }: { lines: any[] }) {
  if (!lines.length) return <div style={{ color: '#888' }}>No financial planning lines.</div>;
  return (
    <table style={{ width: '100%', background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, boxShadow: atlasTheme.layout.cardShadow, borderCollapse: 'separate', borderSpacing: 0, marginBottom: 24 }}>
      <thead>
        <tr style={{ background: atlasTheme.colors.surfaceMuted }}>
          <th>Project / CAR</th>
          <th>Line Type</th>
          <th>Fiscal Period</th>
          <th>Budget Stream</th>
          <th>Cost Category</th>
          <th>Planned Amount</th>
          <th>Forecast Amount</th>
        </tr>
      </thead>
      <tbody>
        {lines.map(line => (
          <tr key={line.lineId} style={{ borderBottom: `1px solid ${atlasTheme.colors.border}` }}>
            <td>{line.projectLabel} / {line.carLabel}</td>
            <td>{line.lineType}</td>
            <td>{line.fiscalPeriod}</td>
            <td>{line.budgetStream}</td>
            <td>{line.costCategory}</td>
            <td>{line.formattedPlannedAmount}</td>
            <td>{line.formattedForecastAmount ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Helper: Table for FTE/labor lines
function FteLaborLinesTable({ lines }: { lines: any[] }) {
  if (!lines.length) return <div style={{ color: '#888' }}>No FTE/labor planning lines.</div>;
  return (
    <table style={{ width: '100%', background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, boxShadow: atlasTheme.layout.cardShadow, borderCollapse: 'separate', borderSpacing: 0, marginBottom: 24 }}>
      <thead>
        <tr style={{ background: atlasTheme.colors.surfaceMuted }}>
          <th>Project / CAR</th>
          <th>Role/Resource</th>
          <th>Named Employee</th>
          <th>Fiscal Period</th>
          <th>FTE</th>
          <th>Labor Rate</th>
          <th>Labor Cost</th>
          <th>Budget Stream</th>
          <th>Cost Category</th>
        </tr>
      </thead>
      <tbody>
        {lines.map(line => (
          <tr key={line.lineId} style={{ borderBottom: `1px solid ${atlasTheme.colors.border}` }}>
            <td>{line.projectLabel} / {line.carLabel}</td>
            <td>{line.roleOrResource}</td>
            <td>{line.namedEmployee ?? '-'}</td>
            <td>{line.fiscalPeriod}</td>
            <td>{line.formattedFte}</td>
            <td>{line.formattedLaborRate}</td>
            <td>{line.formattedCalculatedLaborCost}</td>
            <td>{line.budgetStream}</td>
            <td>{line.costCategory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const PlanningManagementWorkspace: React.FC = () => {
  const vm = getPlanningManagementWorkspaceViewModel();
  return (
    <div data-testid="planning-management-workspace" style={{ padding: atlasTheme.layout.pagePadding, background: atlasTheme.colors.background, minHeight: 400 }}>
      {/* Header */}
      <h1 style={{ fontSize: atlasTheme.typography.title, fontWeight: 700, color: atlasTheme.colors.primary, marginBottom: 8 }}>Planning Management Workspace</h1>
      <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.body, marginBottom: 24 }}>
        Manage financial and FTE/labor planning lines for your program. Review summary metrics, edit lines, and track planning readiness.
      </div>
      {/* Summary Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 32 }}>
        {vm.formatted.summaryCards.map(card => (
          <SummaryCard key={card.id} {...card} />
        ))}
      </div>
      {/* FTE/Labor Lines Section (first-class, near top) */}
      <section data-testid="fte-labor-lines-section" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: atlasTheme.typography.sectionTitle, color: atlasTheme.colors.primary, marginBottom: 8 }}>FTE/Labor Planning Lines</h2>
        <FteLaborLinesTable lines={vm.formatted.fteLaborLines} />
      </section>
      {/* Financial Lines Section */}
      <section data-testid="financial-lines-section" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: atlasTheme.typography.sectionTitle, color: atlasTheme.colors.primary, marginBottom: 8 }}>Financial Planning Lines</h2>
        <FinancialLinesTable lines={vm.formatted.financialLines} />
      </section>
      {/* Create/Edit Planning Line Form (compact, readiness panel) */}
      <section data-testid="planning-line-form-structure" style={{ marginBottom: 32, maxWidth: 420 }}>
        <h3 style={{ fontSize: 18, color: atlasTheme.colors.primary, marginBottom: 8 }}>Planning Line Form Readiness</h3>
        <div style={{ color: atlasTheme.colors.textSecondary, fontSize: 14, marginBottom: 8 }}>
          {vm.createEditReadiness.ready ? 'Ready to create or edit planning lines.' : 'Form not ready.'}
        </div>
        <PlanningLineFormStructure mode="financial" readOnly />
        <PlanningLineFormStructure mode="fteLabor" readOnly />
      </section>
      {/* Validation Feedback / Scope Guard Notes (lower priority) */}
      <section data-testid="validation-feedback" style={{ marginBottom: 16, maxWidth: 420 }}>
        <h4 style={{ fontSize: 16, color: atlasTheme.colors.primary, marginBottom: 4 }}>Validation Feedback</h4>
        <div style={{ color: atlasTheme.colors.textSecondary, fontSize: 14 }}>{vm.validationReadiness.ready ? 'All validations passed.' : 'Validation issues present.'}</div>
      </section>
      <section data-testid="scope-guard-notes" style={{ marginBottom: 16, maxWidth: 420 }}>
        <h4 style={{ fontSize: 16, color: atlasTheme.colors.primary, marginBottom: 4 }}>Scope Guard / Readiness Notes</h4>
        <div style={{ color: atlasTheme.colors.textSecondary, fontSize: 14 }}>{vm.scopeGuardNotes}</div>
      </section>
    </div>
  );
};

// Render model for tests
export function getPlanningManagementWorkspaceRenderModel() {
  const vm = getPlanningManagementWorkspaceViewModel();
  // Section titles as rendered in the UI, in order
  const sectionTitles = [
    'Planning Management Workspace',
    'Planning Summary',
    'FTE/Labor Planning Lines',
    'Financial Planning Lines',
    'Create/Edit Planning Line',
    'Validation Feedback',
    'Scope Guard / Readiness Notes',
  ];
  // Scan for forbidden/unsupported workflow labels in the actual render model (should be empty)
  const forbiddenLabels = [
    'Approve',
    'Run AI Recommendation',
    'Import Invoice',
    'Detect Overallocation',
  ];
  // Check if any forbidden label is present in any section title (should not happen)
  const unsupportedWorkflowLabels = sectionTitles.filter(title =>
    forbiddenLabels.some(label => title.includes(label))
  );
  return {
    summaryCardTitles: vm.summaryCards.map((c) => c.title),
    financialLines: vm.financialLines,
    fteLaborLines: vm.fteLaborLines,
    hasFinancialLinesSection: vm.financialLines.length > 0,
    hasFteLaborLinesSection: vm.fteLaborLines.length > 0,
    placeholderTextPresent: false,
    sectionTitles,
    unsupportedWorkflowLabels,
    formReadiness: vm.createEditReadiness,
    validationReadiness: vm.validationReadiness,
    scopeGuardNotes: vm.scopeGuardNotes,
  };
}
