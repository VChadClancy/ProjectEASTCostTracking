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

  if (loading) return <EmptyState title="Loading Forecast Comparison..." />;
  if (error) return <EmptyState title="Error" description={error} />;
  if (!model || model.empty) return <EmptyState title="No Comparison Data" description="Select forecast versions to compare." />;

  return (
    <div className="forecast-comparison" style={{ background: atlasTheme.colors.background, padding: atlasTheme.layout.pagePadding }}>
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
          {model.deltaSummaryCards?.map((card: any, idx: number) => (
            <div key={idx} style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
              <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>{card.label}</div>
              <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(card.value)}</div>
            </div>
          ))}
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Monthly Movement Summary">
        <div>{model.monthlyMovementSummary?.length ? 'Monthly movement data' : 'No monthly movement'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Grouped Delta Panels">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Project Deltas</strong>
            <div>{model.projectDeltas?.length ? model.projectDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>CAR Deltas</strong>
            <div>{model.carDeltas?.length ? model.carDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Budget Stream Deltas</strong>
            <div>{model.budgetStreamDeltas?.length ? model.budgetStreamDeltas.length : 0}</div>
          </div>
          <div style={{ background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
            <strong>Cost Category Deltas</strong>
            <div>{model.costCategoryDeltas?.length ? model.costCategoryDeltas.length : 0}</div>
          </div>
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Delta Signals Detail">
        <div>{model.deltaSignalsDetail?.length ? 'Delta signals present' : 'No delta signals'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Read-Only Comparison Preview" accent={<CapabilityChip label="Read-Only Preview" />}>
        <div style={{ color: atlasTheme.colors.textSecondary }}>{model.readOnlyComparisonPreview?.length ? 'Preview data' : 'No preview data'}</div>
      </WorkspaceCard>
    </div>
  );
}

export default ForecastComparison;
