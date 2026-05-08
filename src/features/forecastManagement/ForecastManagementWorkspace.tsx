import React, { useEffect, useState } from 'react';
import {
  getForecastManagementWorkspaceSections,
  ForecastManagementWorkspaceSection,
  type ForecastManagementWorkspaceSectionStatus,
} from './forecastManagementWorkspaceModel';
import { getForecastManagementWorkspaceViewModel } from './forecastManagementDataAdapter';

import { PageHeader } from '../../components/shell/PageHeader';
import { WorkspaceCard } from '../../components/shell/WorkspaceCard';
import { StatusBadge } from '../../components/shell/StatusBadge';
import { CapabilityChip } from '../../components/shell/CapabilityChip';
import { EmptyState } from '../../components/shell/EmptyState';
import { ForecastComparison } from '../forecastComparison/ForecastComparison';
import { formatCurrency } from '../../utils/formatCurrency';
import { atlasTheme } from '../../styles/atlasTheme';

export const ForecastManagementWorkspace: React.FC = () => {
  const [vm, setVm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getForecastManagementWorkspaceViewModel()
      .then((data) => {
        if (mounted) {
          setVm(data);
          setError(data.error || null);
        }
      })
      .catch((e) => {
        if (mounted) setError(String(e));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <EmptyState title="Loading forecast workspace..." />;
  if (error) return <EmptyState title="Error loading workspace" description={error} />;
  if (!vm || vm.empty) return <EmptyState title="No forecast versions found" />;

  // Section rendering helpers
  function renderSection(section: ForecastManagementWorkspaceSection) {
    switch (section.id) {
      case 'versionSelector':
        return (
          <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <strong>Base / Current Version</strong>
              <div style={{ marginTop: 8, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
                {vm.selectorItems.filter((item: any) => item.type === 'base').map((item: any) => (
                  <div key={item.id} style={{ color: atlasTheme.colors.textPrimary }}>{item.label}</div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <strong>Compare To Version</strong>
              <div style={{ marginTop: 8, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16 }}>
                {vm.selectorItems.filter((item: any) => item.type === 'compare').map((item: any) => (
                  <div key={item.id} style={{ color: atlasTheme.colors.textPrimary }}>{item.label}</div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'forecastSummaryCards':
        return vm.currentVersionSummary ? (
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
              <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>Budget</div>
              <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(vm.currentVersionSummary.totalBudget)}</div>
            </div>
            <div style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
              <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>Forecast</div>
              <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(vm.currentVersionSummary.totalForecast)}</div>
            </div>
            <div style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
              <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>Actuals</div>
              <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(vm.currentVersionSummary.totalActuals)}</div>
            </div>
            <div style={{ flex: 1, background: atlasTheme.colors.surface, borderRadius: atlasTheme.layout.cardRadius, border: `1px solid ${atlasTheme.colors.border}`, padding: 16, boxShadow: atlasTheme.layout.cardShadow }}>
              <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption }}>Variance</div>
              <div style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.title, fontWeight: 600 }}>{formatCurrency(vm.currentVersionSummary.totalVariance)}</div>
            </div>
          </div>
        ) : null;
      case 'currentVersionMetadata':
        return vm.currentVersion ? (
          <div>
            <strong>Current Version:</strong> {vm.currentVersion.name} (ID: {vm.currentVersion.id})
          </div>
        ) : null;
      case 'snapshotSummary':
        return vm.snapshotSummary ? (
          <div>
            <strong>Snapshot Summary:</strong> {vm.snapshotSummary.label}
          </div>
        ) : null;
      case 'snapshotLinesPreview':
        return (
          <div>
            <strong>Snapshot Lines Preview (read-only):</strong>
            <ul>
              {vm.snapshotLinesPreview.map((line: any, idx: number) => (
                <li key={idx}>{JSON.stringify(line)}</li>
              ))}
            </ul>
          </div>
        );
      case 'recentVersions':
        return (
          <div>
            <strong>Recent Versions:</strong>
            <ul>
              {vm.recentVersions.map((v: any) => (
                <li key={v.id}>{v.name}</li>
              ))}
            </ul>
          </div>
        );
      case 'comparisonOverview':
        // Replace preview with real ForecastComparison component
        return <ForecastComparison />;
      case 'deltaSignalsPreview':
        return (
          <div>
            <strong>Delta Signals Preview:</strong>
            <ul>
              {vm.deltaSignalsPreview.map((ds: any, idx: number) => (
                <li key={idx}>{ds.group} ({ds.severity})</li>
              ))}
            </ul>
          </div>
        );
      default:
        if (section.status === 'preview') {
          return <EmptyState title="Preview only – not fully implemented" />;
        }
        if (section.status === 'future') {
          return <EmptyState title="Placeholder – coming soon" />;
        }
        return null;
    }
  }

  const sections = getForecastManagementWorkspaceSections();

  // Map section.status to StatusBadge variant
  function statusToBadgeVariant(status: ForecastManagementWorkspaceSectionStatus): "success" | "info" | "neutral" {
    switch (status) {
      case "active":
        return "success";
      case "preview":
        return "info";
      case "future":
      case "placeholder":
      default:
        return "neutral";
    }
  }

  return (
    <div className="forecast-management-workspace">
      <PageHeader title="Forecast Management Workspace" />
      <div className="workspace-sections">
        {sections.map((section) => (
          <WorkspaceCard
            key={section.id}
            title={section.title}
            description={section.description}
            accent={
              <>
                <StatusBadge variant={statusToBadgeVariant(section.status)}>
                  {section.status}
                </StatusBadge>
                <CapabilityChip label={section.capabilityArea} />
              </>
            }
          >
            {renderSection(section)}
          </WorkspaceCard>
        ))}
      </div>
    </div>
  );
};

// Forbidden workflow labels (internal, not exposed unless present)
const forbiddenWorkflowLabels = [
  'Edit Forecast',
  'Create Forecast Version',
  'Approve Forecast',
  'Run AI Explanation',
];

// Render model helper for tests
export function getForecastManagementWorkspaceRenderModel() {
  const sections = getForecastManagementWorkspaceSections();
  // Gather all section titles and descriptions
  const allLabels = [
    ...sections.map((s) => s.title),
    ...sections.map((s) => s.description),
  ].join(' ');
  // Only include forbidden labels if actually present
  const unsupportedWorkflowLabels = forbiddenWorkflowLabels.filter(label => allLabels.includes(label));
  return {
    sectionTitles: sections.map((s) => s.title),
    primarySectionTitles: sections.filter(s => s.status === 'active' || s.status === 'preview').map(s => s.title),
    previewSectionTitles: sections.filter(s => s.status === 'preview').map(s => s.title),
    unsupportedWorkflowLabels: unsupportedWorkflowLabels.length > 0 ? unsupportedWorkflowLabels : [],
    readOnlySectionIds: sections.filter(s => s.id === 'snapshotLinesPreview').map(s => s.id),
    placeholderSectionIds: sections.filter(s => s.status === 'future' || s.status === 'placeholder').map(s => s.id),
  };
}
