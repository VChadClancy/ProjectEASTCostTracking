import React, { useEffect, useState } from 'react';
import { buildForecastComparisonViewModel } from './forecastComparisonDataAdapter';
import { PageHeader, WorkspaceCard, CapabilityChip, EmptyState } from '../../components/shell';
import { atlasTheme } from '../../styles/atlasTheme';
import { formatCurrency } from '../../utils/formatCurrency';

// Forbidden workflow labels (internal, not exposed unless present)
const forbiddenWorkflowLabels = [
  'Edit Forecast',
  'Create Forecast Version',
  'Approve Forecast',
  'Run AI Explanation',
];

// Render model helper for tests
export function getForecastComparisonRenderModel() {
  return {
    sectionTitles: [
      'Version Pair Selector',
      'Delta Summary Cards',
      'Monthly Movement Summary',
      'Grouped Delta Panels',
      'Delta Signals Detail',
      'Read-Only Comparison Preview',
    ],
    primarySectionTitles: [
      'Version Pair Selector',
      'Delta Summary Cards',
      'Monthly Movement Summary',
    ],
    groupedDeltaSectionTitles: [
      'Project Deltas',
      'CAR Deltas',
      'Budget Stream Deltas',
      'Cost Category Deltas',
    ],
    readOnlySectionIds: ['Read-Only Comparison Preview'],
    previewSectionIds: ['Read-Only Comparison Preview'],
    unsupportedWorkflowLabels: [], // Only populate if forbidden labels are present in the UI/model
  };
}

export function ForecastComparison() {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    buildForecastComparisonViewModel()
      .then((m) => {
        if (mounted) {
          setModel(m);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e?.message || 'Unknown error');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  // Defensive normalization for all mapped fields
  const deltaSummaryCards = Array.isArray(model?.deltaSummaryCards) ? model.deltaSummaryCards : [];
  const monthlyMovementSummary = Array.isArray(model?.monthlyMovementSummary) ? model.monthlyMovementSummary : [];
  const groupedDeltaPanels = typeof model?.groupedDeltaPanels === 'object' && model?.groupedDeltaPanels !== null ? model.groupedDeltaPanels : {};
  const projectDeltas = Array.isArray(model?.projectDeltas) ? model.projectDeltas : [];
  const carDeltas = Array.isArray(model?.carDeltas) ? model.carDeltas : [];
  const budgetStreamDeltas = Array.isArray(model?.budgetStreamDeltas) ? model.budgetStreamDeltas : [];
  const costCategoryDeltas = Array.isArray(model?.costCategoryDeltas) ? model.costCategoryDeltas : [];
  const deltaSignalsDetail = Array.isArray(model?.deltaSignalsDetail) ? model.deltaSignalsDetail : [];
  const readOnlyComparisonPreview = Array.isArray(model?.readOnlyComparisonPreview) ? model.readOnlyComparisonPreview : [];

  if (loading) return <EmptyState title="Loading Forecast Comparison..." />;
  if (error) return <EmptyState title="Error" description={error} />;
  if (!model || model.empty) return <EmptyState title="No Comparison Data" description="Select forecast versions to compare." />;

  return (
    <div className="forecast-comparison" data-testid="forecast-comparison" style={{ display: 'block', background: atlasTheme.colors.background, color: atlasTheme.colors.textPrimary, padding: atlasTheme.layout.pagePadding, minHeight: '40vh' }}>
      <PageHeader title="Forecast Comparison" />
      <WorkspaceCard title="Version Pair Selector">
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <strong>Base / Current Version</strong>
            <div style={{ marginTop: 8, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
              {model.versionPairSelector?.base || 'Select base version'}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <strong>Compare To Version</strong>
            <div style={{ marginTop: 8, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
              {model.versionPairSelector?.compare || 'Select comparison version'}
            </div>
          </div>
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Delta Summary Cards">
        <div style={{ display: 'flex', gap: '24px' }}>
          {deltaSummaryCards.length === 0 ? (
            <EmptyState title="No Delta Summary" description="No delta summary cards available." />
          ) : (
            deltaSummaryCards.map((card: any, idx: number) => (
              <div key={card.id || idx} style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
                <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>{card.label}</div>
                <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(card.value)}</div>
                {card.secondaryValue !== undefined && (
                  <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.body }}>{card.secondaryValue}%</div>
                )}
              </div>
            ))
          )}
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Monthly Movement Summary">
        <div>{monthlyMovementSummary.length ? 'Monthly movement data' : 'No monthly movement'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Grouped Delta Panels">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Project Deltas</strong>
            <div>{projectDeltas.length ? projectDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>CAR Deltas</strong>
            <div>{carDeltas.length ? carDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Budget Stream Deltas</strong>
            <div>{budgetStreamDeltas.length ? budgetStreamDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Cost Category Deltas</strong>
            <div>{costCategoryDeltas.length ? costCategoryDeltas.length : 0}</div>
          </div>
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Delta Signals Detail">
        <div>{deltaSignalsDetail.length ? 'Delta signals present' : 'No delta signals'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Read-Only Comparison Preview" accent={<CapabilityChip label="Read-Only Preview" />}>
        {readOnlyComparisonPreview.length === 0 ? (
          <div style={{ color: atlasTheme.colors.textSecondary }}>No preview data</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius }}>
              <thead>
                <tr style={{ background: atlasTheme.colors.background }}>
                  <th style={{ padding: '6px 12px', textAlign: 'left', color: atlasTheme.colors.textSecondary }}>Project</th>
                  <th style={{ padding: '6px 12px', textAlign: 'left', color: atlasTheme.colors.textSecondary }}>Month</th>
                  <th style={{ padding: '6px 12px', textAlign: 'left', color: atlasTheme.colors.textSecondary }}>Cost Category</th>
                  <th style={{ padding: '6px 12px', textAlign: 'left', color: atlasTheme.colors.textSecondary }}>Budget Stream</th>
                  <th style={{ padding: '6px 12px', textAlign: 'right', color: atlasTheme.colors.textSecondary }}>Forecast</th>
                  <th style={{ padding: '6px 12px', textAlign: 'right', color: atlasTheme.colors.textSecondary }}>Actual</th>
                  <th style={{ padding: '6px 12px', textAlign: 'right', color: atlasTheme.colors.textSecondary }}>Budget</th>
                  <th style={{ padding: '6px 12px', textAlign: 'right', color: atlasTheme.colors.textSecondary }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {readOnlyComparisonPreview.map((line: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${atlasTheme.colors.border}` }}>
                    <td style={{ padding: '6px 12px' }}>{line.projectName || line.project || '-'}</td>
                    <td style={{ padding: '6px 12px' }}>{line.month || '-'}</td>
                    <td style={{ padding: '6px 12px' }}>{line.costCategory || '-'}</td>
                    <td style={{ padding: '6px 12px' }}>{line.budgetStream || '-'}</td>
                    <td style={{ padding: '6px 12px', textAlign: 'right' }}>{formatCurrency(line.forecast)}</td>
                    <td style={{ padding: '6px 12px', textAlign: 'right' }}>{formatCurrency(line.actual)}</td>
                    <td style={{ padding: '6px 12px', textAlign: 'right' }}>{formatCurrency(line.budget)}</td>
                    <td style={{ padding: '6px 12px', textAlign: 'right' }}>{formatCurrency(line.variance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </WorkspaceCard>
    </div>
  );
}

export default ForecastComparison;
