import React, { useEffect, useState } from 'react';
import { getPrimaryProgramWorkspaceSections, getFutureProgramWorkspaceSections } from './programWorkspaceModel';
import { PageHeader } from '../../components/shell/PageHeader';
import { WorkspaceCard } from '../../components/shell/WorkspaceCard';
import { StatusBadge } from '../../components/shell/StatusBadge';
import { CapabilityChip } from '../../components/shell/CapabilityChip';
import { EmptyState } from '../../components/shell/EmptyState';
import { RightRailPlaceholder } from '../../components/shell/RightRailPlaceholder';
import { getProgramWorkspaceSummary, ProgramWorkspaceSummaryViewModel } from './programWorkspaceDataAdapter';

// Local helpers for formatting
function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

// Helper for tests: returns render model metadata
export function getProgramWorkspaceRenderModel() {
  const primarySections = getPrimaryProgramWorkspaceSections();
  const futureSections = getFutureProgramWorkspaceSections();
  return {
    primarySectionTitles: primarySections.map(s => s.title),
    futureSectionTitles: futureSections.map(s => s.title),
    unsupportedWorkflowLabels: ['Create Financial Line', 'Edit Financial Line', 'Actuals Intake Workflow'],
  };
}

// Map section.status to StatusBadge variant
function statusToVariant(status: string): 'success' | 'info' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'preview') return 'info';
  return 'neutral';
}

export const ProgramWorkspace: React.FC = () => {
  const [summary, setSummary] = useState<ProgramWorkspaceSummaryViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const primarySections = getPrimaryProgramWorkspaceSections();
  const futureSections = getFutureProgramWorkspaceSections();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProgramWorkspaceSummary()
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError('Failed to load summary');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="program-workspace-root">
      <PageHeader
        title="Program Financial Workspace"
        description="Central operating surface for program financial visibility"
        eyebrow="Financials"
      />
      <div className="program-workspace-cards">
        {/* Summary Cards */}
        <WorkspaceCard
          title="Program Financial Summary"
          description={summary?.programName || ''}
          accent={<StatusBadge variant="success">Active</StatusBadge>}
        >
          {loading && <EmptyState title="Loading" description="Loading program summary..." />}
          {error && <EmptyState title="Error" description={error} />}
          {!loading && !error && summary && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              <SummaryMetric label="Total Budget" value={formatCurrency(summary.totalBudget)} />
              <SummaryMetric label="Total Forecast" value={formatCurrency(summary.totalForecast)} />
              <SummaryMetric label="Total Actuals" value={formatCurrency(summary.totalActuals)} />
              <SummaryMetric label="Variance" value={`${formatCurrency(summary.varianceAmount)} (${formatPercent(summary.variancePercent)})`} />
              <SummaryMetric label="Active Projects" value={summary.activeProjectCount} />
              <SummaryMetric label="Financial Lines" value={summary.financialLineCount} />
            </div>
          )}
          {!loading && !error && summary && summary.totalBudget === 0 && (
            <EmptyState title="No Data" description="No program summary data available." />
          )}
        </WorkspaceCard>
        {/* Financial Line Preview Section */}
        <WorkspaceCard
          title="Financial Line Preview"
          description="Preview of key financial lines (top 5)"
          accent={<StatusBadge variant="success">Active</StatusBadge>}
        >
          {loading && <EmptyState title="Loading" description="Loading financial lines..." />}
          {error && <EmptyState title="Error" description={error} />}
          {!loading && !error && summary && summary.financialLinePreview && summary.financialLinePreview.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary.financialLinePreview.map((line) => (
                <div key={line.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
                  <span style={{ minWidth: 80, fontWeight: 500 }}>{line.label}</span>
                  <span style={{ minWidth: 80 }}>{line.budgetStream || ''}</span>
                  <span style={{ minWidth: 80 }}>{line.costCategoryKey || ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof line.forecastAmount === 'number' ? formatCurrency(line.forecastAmount) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof line.actualAmount === 'number' ? formatCurrency(line.actualAmount) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof line.varianceAmount === 'number' ? formatCurrency(line.varianceAmount) : ''}</span>
                  {line.status && <StatusBadge variant={statusToVariant(line.status.toLowerCase())}>{line.status}</StatusBadge>}
                </div>
              ))}
              <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>View full management workflow coming later</div>
            </div>
          )}
          {!loading && !error && summary && (!summary.financialLinePreview || summary.financialLinePreview.length === 0) && (
            <EmptyState title="No Financial Lines" description="No financial lines available for preview." />
          )}
        </WorkspaceCard>
        {/* Other primary sections */}
        {primarySections.filter(s => s.id !== 'programFinancialSummary').map((section) => (
          <WorkspaceCard
            key={section.id}
            title={section.title}
            description={section.description}
            accent={
              <StatusBadge variant={statusToVariant(section.status)}>
                {section.status === 'active' ? 'Active' : section.status === 'preview' ? 'Preview' : 'Planned'}
              </StatusBadge>
            }
          >
            <CapabilityChip label={section.capabilityArea} />
          </WorkspaceCard>
        ))}
        {futureSections.map((section) => (
          <WorkspaceCard
            key={section.id}
            title={section.title}
            description={section.description}
            accent={
              <StatusBadge variant={statusToVariant(section.status)}>
                {section.status === 'future' || section.status === 'placeholder' ? 'Planned' : 'Preview'}
              </StatusBadge>
            }
          >
            <CapabilityChip label={section.capabilityArea} />
            <EmptyState title="Coming soon" description="This workflow will be available in a future release." />
          </WorkspaceCard>
        ))}
      </div>
      <RightRailPlaceholder />
    </div>
  );
};

// SummaryMetric: simple presentational helper
const SummaryMetric: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ minWidth: 120, marginRight: 24 }}>
    <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{label}</div>
    <div style={{ fontWeight: 600, fontSize: 20 }}>{value}</div>
  </div>
);
