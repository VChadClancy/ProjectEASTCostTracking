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
        {/* Variance Signals Section */}
        <WorkspaceCard
          title="Variance Signals"
          description="Key variance signals (top 3-5, no AI)"
          accent={<StatusBadge variant="info">Preview</StatusBadge>}
        >
          {loading && <EmptyState title="Loading" description="Loading variance signals..." />}
          {error && <EmptyState title="Error" description={error} />}
          {!loading && !error && summary && summary.varianceSignals && summary.varianceSignals.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary.varianceSignals.map(signal => (
                <div key={signal.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
                  <span style={{ minWidth: 120, fontWeight: 500 }}>{signal.label}</span>
                  <span style={{ minWidth: 220 }}>{signal.description}</span>
                  <span style={{ minWidth: 100 }}>{typeof signal.varianceAmount === 'number' ? formatCurrency(signal.varianceAmount) : ''}</span>
                  {typeof signal.variancePercent === 'number' && (
                    <span style={{ minWidth: 80 }}>{formatPercent(signal.variancePercent)}</span>
                  )}
                  <StatusBadge 
                    variant={signal.severity === 'healthy' ? 'success' : signal.severity === 'info' ? 'neutral' : 'info'}
                  >
                    {signal.severity.charAt(0).toUpperCase() + signal.severity.slice(1)}
                  </StatusBadge>
                  <span style={{ minWidth: 100, color: '#888', fontSize: 13 }}>{signal.relatedArea}</span>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && summary && (!summary.varianceSignals || summary.varianceSignals.length === 0) && (
            <EmptyState title="No Variance Signals" description="No significant variance signals detected." />
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
        {/* Active Projects / CARs Overview Section */}
        <WorkspaceCard
          title="Active Projects / CARs Overview"
          description="Overview of active projects and CARs (top 5)"
          accent={<StatusBadge variant="success">Active</StatusBadge>}
        >
          {loading && <EmptyState title="Loading" description="Loading projects and CARs..." />}
          {error && <EmptyState title="Error" description={error} />}
          {!loading && !error && summary && summary.projectsAndCarsOverview && summary.projectsAndCarsOverview.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {summary.projectsAndCarsOverview.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
                  <span style={{ minWidth: 80, fontWeight: 500 }}>{item.projectId || item.carId || item.id}</span>
                  <span style={{ minWidth: 120 }}>{item.projectName || item.carName || ''}</span>
                  <span style={{ minWidth: 80 }}>{item.status || ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.budget === 'number' && item.budget > 0 ? formatCurrency(item.budget) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.forecast === 'number' && item.forecast > 0 ? formatCurrency(item.forecast) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.actual === 'number' && item.actual > 0 ? formatCurrency(item.actual) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.variance === 'number' && item.variance !== 0 ? formatCurrency(item.variance) : ''}</span>
                  <span style={{ minWidth: 60 }}>{typeof item.financialLineCount === 'number' && item.financialLineCount > 0 ? item.financialLineCount : ''}</span>
                </div>
              ))}
              <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Drill-in management coming later</div>
            </div>
          )}
          {!loading && !error && summary && (!summary.projectsAndCarsOverview || summary.projectsAndCarsOverview.length === 0) && (
            <EmptyState title="No Projects or CARs" description="No active projects or CARs available for overview." />
          )}
        </WorkspaceCard>
        {/* Budget Stream / Funding Section */}
        <WorkspaceCard
          title="Budget Stream / Funding"
          description="Summary by budget stream or funding source (top 5)"
          accent={<StatusBadge variant="success">Active</StatusBadge>}
        >
          {loading && <EmptyState title="Loading" description="Loading budget streams..." />}
          {error && <EmptyState title="Error" description={error} />}
          {!loading && !error && summary && summary.budgetStreamFunding && summary.budgetStreamFunding.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', fontWeight: 600, gap: 16, fontSize: 14, color: '#555', padding: '4px 0' }}>
                <span style={{ minWidth: 120 }}>Budget Stream</span>
                <span style={{ minWidth: 100 }}>Total Budget</span>
                <span style={{ minWidth: 100 }}>Total Forecast</span>
                <span style={{ minWidth: 100 }}>Total Actuals</span>
                <span style={{ minWidth: 100 }}>Variance</span>
                <span style={{ minWidth: 60 }}>Lines</span>
              </div>
              {summary.budgetStreamFunding.map((item) => (
                <div key={item.budgetStream} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
                  <span style={{ minWidth: 120 }}>{item.budgetStream}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.totalBudget === 'number' ? formatCurrency(item.totalBudget) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.totalForecast === 'number' ? formatCurrency(item.totalForecast) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.totalActuals === 'number' ? formatCurrency(item.totalActuals) : ''}</span>
                  <span style={{ minWidth: 100 }}>{typeof item.variance === 'number' ? formatCurrency(item.variance) : ''}</span>
                  <span style={{ minWidth: 60 }}>{typeof item.financialLineCount === 'number' ? item.financialLineCount : ''}</span>
                </div>
              ))}
              <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>Funding rollup for visibility only</div>
            </div>
          )}
          {!loading && !error && summary && (!summary.budgetStreamFunding || summary.budgetStreamFunding.length === 0) && (
            <EmptyState title="No Budget Streams" description="No budget stream or funding data available." />
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
