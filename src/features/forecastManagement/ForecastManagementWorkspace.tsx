import React from 'react';
import {
  getForecastManagementWorkspaceSections,
  ForecastManagementWorkspaceSection,
} from './forecastManagementWorkspaceModel';

import { PageHeader } from '../../components/shell/PageHeader';
import { WorkspaceCard } from '../../components/shell/WorkspaceCard';
import { StatusBadge } from '../../components/shell/StatusBadge';
import { CapabilityChip } from '../../components/shell/CapabilityChip';
import { EmptyState } from '../../components/shell/EmptyState';

export const ForecastManagementWorkspace: React.FC = () => {
  const sections = getForecastManagementWorkspaceSections();

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
                <StatusBadge variant={
                  section.status === 'active' ? 'success' :
                  section.status === 'preview' ? 'info' :
                  section.status === 'future' ? 'neutral' :
                  'neutral'
                }>
                  {section.status}
                </StatusBadge>
                <CapabilityChip label={section.capabilityArea} />
              </>
            }
          >
            {/* Section-specific placeholders */}
            {section.status === 'preview' && (
              <EmptyState title="Preview only – not fully implemented" />
            )}
            {section.status === 'future' && (
              <EmptyState title="Placeholder – coming soon" />
            )}
            {section.id === 'snapshotLinesPreview' && (
              <EmptyState title="Read-only preview. Editing not available." />
            )}
            {section.id === 'versionSelector' && (
              <div style={{ fontStyle: 'italic', color: '#888' }}>
                Version Selector control goes here.
              </div>
            )}
            {section.id === 'comparisonOverview' && (
              <div style={{ fontStyle: 'italic', color: '#888' }}>
                Comparison controls/overview placeholder.
              </div>
            )}
          </WorkspaceCard>
        ))}
      </div>
    </div>
  );
};

// Render model helper for tests
export function getForecastManagementWorkspaceRenderModel() {
  const sections = getForecastManagementWorkspaceSections();
  return {
    sectionTitles: sections.map((s) => s.title),
    primarySectionTitles: sections.filter(s => s.status === 'active' || s.status === 'preview').map(s => s.title),
    previewSectionTitles: sections.filter(s => s.status === 'preview').map(s => s.title),
    unsupportedWorkflowLabels: [
      'Edit Forecast',
      'Create Forecast Version',
      'Approve Forecast',
      'Run AI Explanation',
    ],
    readOnlySectionIds: sections.filter(s => s.id === 'snapshotLinesPreview').map(s => s.id),
    placeholderSectionIds: sections.filter(s => s.status === 'future' || s.status === 'placeholder').map(s => s.id),
  };
}
