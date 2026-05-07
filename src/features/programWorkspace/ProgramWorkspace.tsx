import React from 'react';
import { getPrimaryProgramWorkspaceSections, getFutureProgramWorkspaceSections } from './programWorkspaceModel';
import { PageHeader } from '../../components/shell/PageHeader';
import { WorkspaceCard } from '../../components/shell/WorkspaceCard';
import { StatusBadge } from '../../components/shell/StatusBadge';
import { CapabilityChip } from '../../components/shell/CapabilityChip';
import { EmptyState } from '../../components/shell/EmptyState';
import { RightRailPlaceholder } from '../../components/shell/RightRailPlaceholder';

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
  const primarySections = getPrimaryProgramWorkspaceSections();
  const futureSections = getFutureProgramWorkspaceSections();

  return (
    <div className="program-workspace-root">
      <PageHeader
        title="Program Financial Workspace"
        description="Central operating surface for program financial visibility"
        eyebrow="Financials"
      />
      <div className="program-workspace-cards">
        {primarySections.map((section) => (
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
