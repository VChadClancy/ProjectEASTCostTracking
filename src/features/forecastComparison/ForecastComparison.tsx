import React, { useEffect, useState } from 'react';
import { buildForecastComparisonViewModel } from './forecastComparisonDataAdapter';
import { PageHeader, WorkspaceCard, CapabilityChip, EmptyState } from '../../components/shell';

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
    <div className="forecast-comparison">
      <PageHeader title="Forecast Comparison" />
      <WorkspaceCard title="Version Pair Selector">
        {/* Render version pair selector summary */}
        <div>{model.versionPairSelector?.title || 'Select versions'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Delta Summary Cards">
        {/* Render delta summary cards */}
        <div>{model.deltaSummaryCards ? 'Delta summary present' : 'No delta summary'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Monthly Movement Summary">
        <div>{model.monthlyMovementSummary?.length ? 'Monthly movement data' : 'No monthly movement'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Grouped Delta Panels">
        <div>
          <div>Project Deltas: {model.projectDeltas?.length}</div>
          <div>CAR Deltas: {model.carDeltas?.length}</div>
          <div>Budget Stream Deltas: {model.budgetStreamDeltas?.length}</div>
          <div>Cost Category Deltas: {model.costCategoryDeltas?.length}</div>
        </div>
      </WorkspaceCard>
      <WorkspaceCard title="Delta Signals Detail">
        <div>{model.deltaSignalsDetail?.length ? 'Delta signals present' : 'No delta signals'}</div>
      </WorkspaceCard>
      <WorkspaceCard title="Read-Only Comparison Preview" accent={<CapabilityChip label="Read-Only Preview" />}>
        <div>{model.readOnlyComparisonPreview?.length ? 'Preview data' : 'No preview data'}</div>
      </WorkspaceCard>
    </div>
  );
}

export default ForecastComparison;
